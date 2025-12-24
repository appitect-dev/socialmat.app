"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    Play,
    Pause,
    Volume2,
    Download,
    Sparkles,
    Wand2,
    Scissors,
    Type,
} from "lucide-react";

interface VideoEditorProps {
    videoUrl: string;
    onExport?: (editedVideo: Blob) => void;
}

export function VideoEditor({ videoUrl, onExport }: VideoEditorProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [selectedEffect, setSelectedEffect] = useState<string>("none");
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(100);

    const videoRef = useRef<HTMLVideoElement>(null);

    const effects = [
        { id: "none", name: "Žádný", filter: "none" },
        { id: "grayscale", name: "Černobílé", filter: "grayscale(100%)" },
        { id: "sepia", name: "Sepia", filter: "sepia(100%)" },
        { id: "blur", name: "Blur", filter: "blur(3px)" },
        { id: "vintage", name: "Vintage", filter: "sepia(0.5) contrast(1.2)" },
    ];

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setTrimEnd(videoRef.current.duration);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0];
        }
    };

    const handleVolumeChange = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.volume = value[0];
            setVolume(value[0]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getFilterStyle = () => {
        const baseFilter = effects.find((e) => e.id === selectedEffect)?.filter || "none";
        const customFilters = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        return baseFilter === "none" ? customFilters : `${baseFilter} ${customFilters}`;
    };

    return (
        <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full"
                    style={{ filter: getFilterStyle() }}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>

            {/* Timeline */}
            <div className="space-y-2">
                <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button size="icon" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                        value={[volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                    />
                </div>
            </div>

            {/* Effects Grid */}
            <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Video filtry
                </h3>
                <div className="grid grid-cols-5 gap-2">
                    {effects.map((effect) => (
                        <Button
                            key={effect.id}
                            size="sm"
                            variant={selectedEffect === effect.id ? "default" : "outline"}
                            onClick={() => setSelectedEffect(effect.id)}
                        >
                            {effect.name}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Manual Adjustments */}
            <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Ruční úpravy
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Jas: {brightness}%</label>
                        <Slider
                            value={[brightness]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={(v: number[]) => setBrightness(v[0])}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kontrast: {contrast}%</label>
                        <Slider
                            value={[contrast]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={(v: number[]) => setContrast(v[0])}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Saturace: {saturation}%</label>
                        <Slider
                            value={[saturation]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={(v: number[]) => setSaturation(v[0])}
                        />
                    </div>
                </div>
            </Card>

            {/* Trim Controls */}
            <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Scissors className="h-4 w-4" />
                    Střih videa
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Začátek: {formatTime(trimStart)}
                        </label>
                        <Slider
                            value={[trimStart]}
                            max={duration}
                            step={0.1}
                            onValueChange={(v: number[]) => setTrimStart(v[0])}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Konec: {formatTime(trimEnd)}
                        </label>
                        <Slider
                            value={[trimEnd]}
                            max={duration}
                            step={0.1}
                            onValueChange={(v: number[]) => setTrimEnd(v[0])}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
