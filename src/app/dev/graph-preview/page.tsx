"use client";

import * as React from "react";

import { ChartCard, type LineSeries } from "@/components/ChartCard";

type MockCard = {
  title: string;
  value: string;
  description: string;
  series: LineSeries[];
  xLabels: string[];
  showDots?: boolean;
};

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthLabels = ["W1", "W2", "W3", "W4"];
const denseLabels = Array.from({ length: 14 }, (_, i) => `D${i + 1}`);

const mockCards: MockCard[] = [
  {
    title: "Reach",
    value: "19.5K",
    description: "Unique accounts reached",
    xLabels: denseLabels,
    series: [
      {
        data: [
          1200, 1700, 2400, 2100, 1900, 2600, 3200, 3000, 2800, 3500, 4100,
          3900, 3800, 4200,
        ],
        color: "#4584E9",
      },
    ],
  },
  {
    title: "Profile views",
    value: "3.1K",
    description: "Profile visits this week",
    xLabels: denseLabels,
    series: [
      {
        data: [320, 360, 410, 390, 380, 430, 520, 480, 470, 530, 610, 560, 520, 590],
        color: "#3FA7A7",
      },
    ],
  },
  {
    title: "Accounts engaged",
    value: "2.4K",
    description: "Likes, comments, shares",
    xLabels: denseLabels,
    series: [
      {
        data: [210, 260, 330, 290, 280, 340, 360, 390, 410, 460, 520, 480, 470, 510],
        color: "#F59E0B",
      },
    ],
  },
  {
    title: "Followers (4 weeks)",
    value: "+820",
    description: "Net followers gain",
    xLabels: monthLabels,
    series: [
      {
        data: [180, 210, 190, 240],
        color: "#7C3AED",
      },
    ],
  },
];

export default function GraphPreviewPage() {
  return (
    <main className="flex min-h-screen flex-col gap-6 bg-[#f6f7fb] px-6 py-8 text-[#0f1113]">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Graph preview (mock data)</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockCards.map((card) => (
          <ChartCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            xLabels={card.xLabels}
            series={card.series}
            showDots={card.showDots}
          />
        ))}
      </section>
    </main>
  );
}
