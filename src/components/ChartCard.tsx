import * as React from "react";

import { cn } from "@/lib/utils";

export type LineSeries = {
  data: number[];
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  strokeWidth?: number;
};

export type LineChartProps = {
  className?: string;
  xLabels?: string[];
  yTicks?: number[];
  yDomain?: [number, number];
  series?: LineSeries[];
  showDots?: boolean;
};

export type ChartCardProps = {
  className?: string;
  title?: string;
  value?: string;
  description?: string;
  buttonLabel?: string;
  xLabels?: string[];
  yTicks?: number[];
  yDomain?: [number, number];
  series?: LineSeries[];
  showDots?: boolean;
};

const defaultXLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_STROKE = "#4584E9";
const GRID_STROKE = "#BEC1C6";

function normalizeDomain(domain: [number, number]) {
  const min = Math.min(domain[0], domain[1]);
  const max = Math.max(domain[0], domain[1]);
  if (min === max) {
    const bump = min === 0 ? 1 : Math.abs(min * 0.1);
    return [min - bump, max + bump] as [number, number];
  }
  return [min, max] as [number, number];
}

function niceNum(range: number, round: boolean) {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction = 1;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

function generateNiceTicks(domain: [number, number], targetCount = 7) {
  const [min, max] = normalizeDomain(domain);
  const range = max - min || 1;
  const tickSpacing = niceNum(range / (targetCount - 1), true);
  const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
  const ticks: number[] = [];

  for (let v = niceMin; v <= niceMax + tickSpacing * 0.5; v += tickSpacing) {
    ticks.push(Number(v.toFixed(10)));
  }

  return ticks;
}

function computeDomain(series?: LineSeries[], yDomain?: [number, number]) {
  if (yDomain) return normalizeDomain(yDomain);
  if (!series || series.length === 0) return [0, 1] as [number, number];

  const values = series.flatMap((line) => line.data);
  if (values.length === 0) return [0, 1] as [number, number];
  return normalizeDomain([Math.min(...values), Math.max(...values)]);
}

function buildLinePoints(data: number[], domain: [number, number]) {
  if (data.length === 0) return [];
  const [min, max] = domain;
  const range = max - min || 1;
  const lastIndex = Math.max(data.length - 1, 1);

  return data.map((value, index) => {
    const x = (index / lastIndex) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return { x, y };
  });
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${point.x} ${point.y}`;
    })
    .join(" ");
}

function buildAreaPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  const linePath = buildLinePath(points);
  return `${linePath} L${last.x} 100 L${first.x} 100 Z`;
}

function getDots(data: number[], domain: [number, number]) {
  return buildLinePoints(data, domain);
}

export function LineChart({
  className,
  xLabels = defaultXLabels,
  yTicks,
  yDomain,
  series,
  showDots = false,
}: LineChartProps) {
  const gradientSeed = React.useId();
  const { normalizedSeries, trimmedLabels, minSeriesLength, hasMismatch } =
    React.useMemo(() => {
      const labelCount = xLabels.length;
      const seriesLengths = series?.map((line) => line.data.length) ?? [];
      const minLength = seriesLengths.length
        ? Math.min(labelCount, ...seriesLengths)
        : labelCount;
      const trimmed = xLabels.slice(0, minLength);
      const normalized =
        series?.map((line) => ({
          ...line,
          // If xLabels exist, truncate to the shortest length to avoid mismatch.
          data: line.data.slice(0, minLength),
        })) ?? [];

      return {
        normalizedSeries: normalized,
        trimmedLabels: trimmed,
        minSeriesLength: minLength,
        hasMismatch:
          seriesLengths.length > 0 &&
          seriesLengths.some((length) => length !== labelCount),
      };
    }, [series, xLabels]);

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      hasMismatch &&
      series &&
      series.length > 0
    ) {
      const lengths = series.map((line) => line.data.length);
      console.warn(
        `[LineChart] xLabels length (${xLabels.length}) does not match series lengths (${lengths.join(
          ", "
        )}). Truncating to ${minSeriesLength}.`
      );
    }
  }, [hasMismatch, minSeriesLength, series, xLabels.length]);

  const { orderedTicks, seriesPaths, placeholderPath } =
    React.useMemo(() => {
      const baseDomain = computeDomain(normalizedSeries, yDomain);
      const resolvedTicks =
        yTicks && yTicks.length > 0 ? yTicks : generateNiceTicks(baseDomain, 7);
      const tickMin = resolvedTicks.length
        ? Math.min(...resolvedTicks)
        : baseDomain[0];
      const tickMax = resolvedTicks.length
        ? Math.max(...resolvedTicks)
        : baseDomain[1];

      // Expand the effective domain to include any provided ticks.
      const expandedDomain =
        tickMin < baseDomain[0] || tickMax > baseDomain[1]
          ? normalizeDomain([
              Math.min(baseDomain[0], tickMin),
              Math.max(baseDomain[1], tickMax),
            ])
          : baseDomain;

      const range = expandedDomain[1] - expandedDomain[0] || 1;
      const positions = resolvedTicks.map((tick) => ({
        value: tick,
        y: 100 - ((tick - expandedDomain[0]) / range) * 100,
      }));
      const ordered = [...positions].sort((a, b) => a.y - b.y);

      const paths = normalizedSeries.map((line) => {
        const points = buildLinePoints(line.data, expandedDomain);
        return {
          ...line,
          points,
          path: buildLinePath(points),
          area: buildAreaPath(points),
          dots: showDots ? points : [],
        };
      });

      return {
        orderedTicks: ordered,
        seriesPaths: paths,
        placeholderPath: "M0 60 L25 58 L50 62 L75 55 L100 60",
      };
    }, [normalizedSeries, showDots, yDomain, yTicks]);

  const hasSeries = seriesPaths.length > 0;

  return (
    <div className={cn("flex h-[160px] w-full items-center gap-[8px]", className)}>
      <div className="relative h-full w-[28px] shrink-0 text-right text-[10px] font-normal leading-[normal] text-[#3a3e44]">
        <div className="absolute inset-[30px_0_26px_0]">
          {orderedTicks.map((tick, index) => (
            <span
              key={`y-${index}`}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${tick.y}%` }}
            >
              {tick.value}
            </span>
          ))}
        </div>
      </div>
      <div className="relative flex h-full flex-1 flex-col gap-[10px]">
        <div className="flex flex-1 flex-col gap-[2px]">
          <div className="flex flex-1 flex-col justify-between py-[12px]" />
          <div className="flex w-full items-start justify-between text-center text-[10px] font-normal leading-[normal] text-[#3a3e44]">
            {trimmedLabels.map((label, index) => (
              <p key={`x-${index}`} className="shrink-0">
                {label}
              </p>
            ))}
          </div>
        </div>
        <div className="absolute inset-[30px_0_26px_0]">
          <svg
            className="block size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {orderedTicks.map((tick, index) => (
              <line
                key={`grid-${index}`}
                x1="0"
                y1={tick.y}
                x2="100"
                y2={tick.y}
                stroke={GRID_STROKE}
                strokeWidth="0.7"
                strokeDasharray="2 2"
                opacity={0.6}
              />
            ))}
            {hasSeries ? (
              seriesPaths.map((line, index) => (
                <g key={`series-${index}`}>
                  <defs>
                    <linearGradient
                      id={`${gradientSeed}-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          line.gradientFrom ??
                          line.color ??
                          DEFAULT_STROKE
                        }
                        stopOpacity="0.14"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          line.gradientTo ??
                          line.color ??
                          DEFAULT_STROKE
                        }
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {line.area ? (
                    <path
                      d={line.area}
                      fill={`url(#${gradientSeed}-${index})`}
                    />
                  ) : null}
                  <path
                    d={line.path}
                    fill="none"
                    stroke={line.color ?? DEFAULT_STROKE}
                    strokeWidth={line.strokeWidth ?? 1.1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    shapeRendering="geometricPrecision"
                  />
                  {showDots &&
                    line.dots.map((dot, dotIndex) => (
                      <circle
                        key={`dot-${index}-${dotIndex}`}
                        cx={dot.x}
                        cy={dot.y}
                        r="1.4"
                        fill={line.color ?? DEFAULT_STROKE}
                      />
                    ))}
                </g>
              ))
            ) : (
              <path
                d={placeholderPath}
                fill="none"
                stroke={GRID_STROKE}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ChartCard({
  className,
  title = "Card header",
  value = "Data",
  description = "Data display card description",
  buttonLabel = "View data",
  xLabels = defaultXLabels,
  yTicks,
  yDomain,
  series,
  showDots,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-[8px] rounded-[10px] border border-[#e0e2e6] bg-white p-[16px] text-[#3a3e44] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]",
        className
      )}
      style={{ fontFamily: "Inter, var(--font-archivo), Arial, sans-serif" }}
    >
      <header className="flex h-[16px] w-full items-center gap-[4px]">
        <p className="text-[10px] font-normal leading-[normal]">{title}</p>
      </header>

      <div className="flex w-full items-start gap-[4px] pb-[4px]">
        <div className="flex flex-1 flex-col gap-[2px]">
          <p className="text-[20px] font-bold leading-[28px]">{value}</p>
          <p className="text-[10px] font-normal leading-[normal] text-[#616469]">
            {description}
          </p>
        </div>
      </div>

      <LineChart
        xLabels={xLabels}
        yTicks={yTicks}
        yDomain={yDomain}
        series={series}
        showDots={showDots}
      />

      <div className="flex w-full items-start pt-[6px]">
        <button
          className="flex h-[24px] items-center justify-center rounded-[4px] border border-[#e0e2e6] bg-white px-[8px] py-[4px] text-[12px] font-normal leading-[16px] text-[#3a3e44] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
          type="button"
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}
