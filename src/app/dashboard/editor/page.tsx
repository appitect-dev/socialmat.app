"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Download,
    Scissors,
    Wand2,
    Type,
    Image as ImageIcon,
    Sparkles,
    Upload
} from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function VideoEditorPage() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(100);
    const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
    const [textOverlays, setTextOverlays] = useState<Array<{
        id: string;
        text: string;
        x: number;
        y: number;
        fontSize: number;
        color: string;
        fontFamily: string;
    }>>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".avi", ".webm"],
        },
        multiple: false,
    });

    const togglePlayPause = () => {
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
            setCurrentTime(value[0]);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.volume = value[0];
            setVolume(value[0]);
        }
    };

    const applyEffect = (effect: string) => {
        setSelectedEffect(effect);
    };

    const addTextOverlay = () => {
        const newText = {
            id: Date.now().toString(),
            text: "Přidat text",
            x: 50,
            y: 50,
            fontSize: 32,
            color: "#ffffff",
            fontFamily: "Arial",
        };
        setTextOverlays([...textOverlays, newText]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const effects = [
        { id: "none", name: "Žádný", filter: "none" },
        { id: "grayscale", name: "Černobílé", filter: "grayscale(100%)" },
        { id: "sepia", name: "Sepia", filter: "sepia(100%)" },
        { id: "blur", name: "Rozmazání", filter: "blur(5px)" },
        { id: "brightness", name: "Jas", filter: "brightness(1.3)" },
        { id: "contrast", name: "Kontrast", filter: "contrast(1.5)" },
        { id: "saturate", name: "Saturace", filter: "saturate(2)" },
        { id: "vintage", name: "Vintage", filter: "sepia(0.5) contrast(1.2)" },
    ];

    return (
        <div className="h-full w-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Video Editor</h1>
                    <p className="text-muted-foreground">
                        Nahrát, střihat a upravit video profesionálně
                    </p>
                </div>
                <Button size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportovat video
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video Area */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Video Preview */}
                    <Card className="p-6">
                        {!videoUrl ? (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Nahrát video
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Přetáhněte video sem nebo klikněte pro výběr
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Podporované formáty: MP4, MOV, AVI, WebM
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        className="w-full h-full"
                                        style={{
                                            filter: effects.find((e) => e.id === selectedEffect)
                                                ?.filter || "none",
                                        }}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={handleLoadedMetadata}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 pointer-events-none"
                                    />

                                    {/* Text Overlays */}
                                    {textOverlays.map((overlay) => (
                                        <div
                                            key={overlay.id}
                                            className="absolute"
                                            style={{
                                                left: `${overlay.x}%`,
                                                top: `${overlay.y}%`,
                                                fontSize: `${overlay.fontSize}px`,
                                                color: overlay.color,
                                                fontFamily: overlay.fontFamily,
                                                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                                                cursor: "move",
                                            }}
                                        >
                                            {overlay.text}
                                        </div>
                                    ))}
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

                                {/* Controls */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="outline">
                                            <SkipBack className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" onClick={togglePlayPause}>
                                            {isPlaying ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button size="icon" variant="outline">
                                            <SkipForward className="h-4 w-4" />
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
                            </div>
                        )}
                    </Card>

                    {/* Trim Timeline */}
                    {videoUrl && (
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Scissors className="h-5 w-5" />
                                        <h3 className="font-semibold">Střih videa</h3>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatTime(trimStart)} - {formatTime(trimEnd)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Začátek</label>
                                    <Slider
                                        value={[trimStart]}
                                        max={duration}
                                        step={0.1}
                                        onValueChange={(v) => setTrimStart(v[0])}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Konec</label>
                                    <Slider
                                        value={[trimEnd]}
                                        max={duration}
                                        step={0.1}
                                        onValueChange={(v) => setTrimEnd(v[0])}
                                    />
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Tools Panel */}
                <div className="space-y-4">
                    <Card className="p-6">
                        <Tabs defaultValue="effects" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="effects">
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    Efekty
                                </TabsTrigger>
                                <TabsTrigger value="text">
                                    <Type className="h-4 w-4 mr-2" />
                                    Text
                                </TabsTrigger>
                                <TabsTrigger value="media">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Média
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="effects" className="space-y-3 mt-4">
                                <h3 className="text-sm font-semibold mb-3">Video filtry</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {effects.map((effect) => (
                                        <Button
                                            key={effect.id}
                                            variant={
                                                selectedEffect === effect.id ? "default" : "outline"
                                            }
                                            className="w-full"
                                            onClick={() => applyEffect(effect.id)}
                                        >
                                            {effect.name}
                                        </Button>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="text" className="space-y-3 mt-4">
                                <h3 className="text-sm font-semibold mb-3">Textové prvky</h3>
                                <Button className="w-full" onClick={addTextOverlay}>
                                    <Type className="h-4 w-4 mr-2" />
                                    Přidat text
                                </Button>
                                <div className="space-y-2">
                                    {textOverlays.map((overlay, index) => (
                                        <Card key={overlay.id} className="p-3">
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={overlay.text}
                                                    onChange={(e) => {
                                                        const newOverlays = [...textOverlays];
                                                        newOverlays[index].text = e.target.value;
                                                        setTextOverlays(newOverlays);
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={overlay.color}
                                                        onChange={(e) => {
                                                            const newOverlays = [...textOverlays];
                                                            newOverlays[index].color = e.target.value;
                                                            setTextOverlays(newOverlays);
                                                        }}
                                                        className="w-8 h-8 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={overlay.fontSize}
                                                        onChange={(e) => {
                                                            const newOverlays = [...textOverlays];
                                                            newOverlays[index].fontSize = parseInt(
                                                                e.target.value
                                                            );
                                                            setTextOverlays(newOverlays);
                                                        }}
                                                        className="w-16 px-2 py-1 text-sm border rounded"
                                                        min="12"
                                                        max="128"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-3 mt-4">
                                <h3 className="text-sm font-semibold mb-3">Přidat média</h3>
                                <Button className="w-full" variant="outline">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Přidat obrázek
                                </Button>
                                <Button className="w-full" variant="outline">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    AI efekty
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </Card>

                    {/* Export Settings */}
                    {videoUrl && (
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Nastavení exportu</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rozlišení</label>
                                    <select className="w-full px-3 py-2 border rounded-md">
                                        <option>1920x1080 (Full HD)</option>
                                        <option>1280x720 (HD)</option>
                                        <option>3840x2160 (4K)</option>
                                        <option>1080x1920 (Instagram Stories)</option>
                                        <option>1080x1080 (Instagram Post)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Formát</label>
                                    <select className="w-full px-3 py-2 border rounded-md">
                                        <option>MP4 (H.264)</option>
                                        <option>WebM</option>
                                        <option>MOV</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kvalita</label>
                                    <select className="w-full px-3 py-2 border rounded-md">
                                        <option>Vysoká</option>
                                        <option>Střední</option>
                                        <option>Nízká</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
