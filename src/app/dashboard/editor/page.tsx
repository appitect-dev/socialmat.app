"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Download,
    Scissors,
    Type,
    Upload,
    Plus,
    Trash2,
    Undo,
    Redo,
    ZoomIn,
    ZoomOut,
    Settings,
    Layers,
    Split,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useDashboardTheme } from "@/components/dashboard-theme";

interface VideoClip {
    id: string;
    start: number;
    end: number;
    duration: number;
}

interface TextOverlay {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
}

export default function VideoEditorPage() {
    const { isDark, palette } = useDashboardTheme();
    
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [selectedTool, setSelectedTool] = useState<string>("select");
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
    const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            
            // Create initial clip with full video
            const newClip: VideoClip = {
                id: Date.now().toString(),
                start: 0,
                end: 0,
                duration: 0,
            };
            setClips([newClip]);
            setSelectedClipId(newClip.id);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".avi", ".webm"],
        },
        maxFiles: 1,
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
            const dur = videoRef.current.duration;
            setDuration(dur);
            
            // Update first clip with actual duration
            if (clips.length > 0) {
                const updatedClips = clips.map(clip => ({
                    ...clip,
                    end: dur,
                    duration: dur,
                }));
                setClips(updatedClips);
            }
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const splitClip = () => {
        if (!selectedClipId) return;
        
        const clip = clips.find(c => c.id === selectedClipId);
        if (!clip || currentTime <= clip.start || currentTime >= clip.end) return;

        const newClip1: VideoClip = {
            ...clip,
            end: currentTime,
            duration: currentTime - clip.start,
        };

        const newClip2: VideoClip = {
            id: Date.now().toString(),
            start: currentTime,
            end: clip.end,
            duration: clip.end - currentTime,
        };

        const newClips = clips.map(c => c.id === selectedClipId ? newClip1 : c);
        const index = newClips.findIndex(c => c.id === selectedClipId);
        newClips.splice(index + 1, 0, newClip2);
        
        setClips(newClips);
        setSelectedClipId(newClip2.id);
    };

    const deleteClip = (clipId: string) => {
        setClips(clips.filter(c => c.id !== clipId));
        if (selectedClipId === clipId) {
            setSelectedClipId(null);
        }
    };

    const effects = [
        { id: "none", name: "Žádný", filter: "none" },
        { id: "grayscale", name: "Černobílá", filter: "grayscale(100%)" },
        { id: "sepia", name: "Sepia", filter: "sepia(100%)" },
        { id: "blur", name: "Rozmazání", filter: "blur(5px)" },
        { id: "brightness", name: "Světlost", filter: "brightness(1.5)" },
        { id: "contrast", name: "Kontrast", filter: "contrast(1.5)" },
        { id: "saturate", name: "Sytost", filter: "saturate(2)" },
        { id: "vintage", name: "Vintage", filter: "sepia(50%) contrast(1.2) brightness(0.9)" },
    ];

    const addTextOverlay = () => {
        const newOverlay: TextOverlay = {
            id: Date.now().toString(),
            text: "Nový text",
            x: 50,
            y: 50,
            fontSize: 32,
            color: "#ffffff",
        };
        setTextOverlays([...textOverlays, newOverlay]);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    const getTimelineWidth = () => {
        return duration * zoom * 100; // pixels per second * zoom
    };

    const getClipPosition = (clip: VideoClip) => {
        const pixelsPerSecond = 100 * zoom;
        return {
            left: clip.start * pixelsPerSecond,
            width: (clip.end - clip.start) * pixelsPerSecond,
        };
    };

    return (
        <div className={`min-h-screen ${palette.page}`}>
            {/* Top Toolbar */}
            <div className={`sticky top-0 z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${palette.border}`}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">Video Editor</h1>
                        <Button variant="ghost" size="icon">
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Nastavení
                        </Button>
                        <Button className={palette.accentButton}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-73px)]">
                {/* Left Sidebar - Tools */}
                <div className={`w-64 border-r ${palette.border} p-4 overflow-y-auto`}>
                    <div className="space-y-4">
                        <div>
                            <h3 className={`text-sm font-semibold mb-3 ${palette.muted}`}>NÁSTROJE</h3>
                            <div className="space-y-1">
                                <Button
                                    variant={selectedTool === "select" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTool("select")}
                                >
                                    <Layers className="h-4 w-4 mr-2" />
                                    Výběr
                                </Button>
                                <Button
                                    variant={selectedTool === "split" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTool("split")}
                                >
                                    <Scissors className="h-4 w-4 mr-2" />
                                    Střih
                                </Button>
                                <Button
                                    variant={selectedTool === "text" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTool("text")}
                                >
                                    <Type className="h-4 w-4 mr-2" />
                                    Text
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-semibold mb-3 ${palette.muted}`}>EFEKTY</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {effects.slice(0, 6).map((effect) => (
                                    <Button
                                        key={effect.id}
                                        variant={selectedEffect === effect.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedEffect(effect.id)}
                                        className="text-xs"
                                    >
                                        {effect.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-semibold mb-3 ${palette.muted}`}>RYCHLOST</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[0.5, 1, 2].map((speed) => (
                                    <Button
                                        key={speed}
                                        variant={playbackSpeed === speed ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPlaybackSpeed(speed)}
                                    >
                                        {speed}x
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {selectedTool === "text" && (
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 ${palette.muted}`}>TEXTOVÉ VRSTVY</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={addTextOverlay}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Přidat text
                                </Button>
                                <div className="mt-3 space-y-2">
                                    {textOverlays.map((overlay) => (
                                        <Card key={overlay.id} className="p-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs truncate">{overlay.text}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => setTextOverlays(textOverlays.filter(t => t.id !== overlay.id))}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Preview */}
                <div className="flex-1 flex flex-col">
                    {/* Preview Area */}
                    <div className={`flex-1 flex items-center justify-center p-8 ${isDark ? 'bg-gradient-to-b from-black/20 to-black/40' : 'bg-gradient-to-b from-slate-50 to-slate-100'}`}>
                        {!videoUrl ? (
                            <Card className={`max-w-2xl w-full p-12 ${palette.card}`}>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                                        isDragActive
                                            ? `border-indigo-500 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`
                                            : `${palette.border} hover:border-indigo-500/50`
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className={`h-16 w-16 mx-auto mb-4 ${palette.muted}`} />
                                    <h3 className="text-2xl font-bold mb-2">Nahrajte video</h3>
                                    <p className={`${palette.muted} mb-4`}>
                                        Přetáhněte video sem nebo klikněte pro výběr
                                    </p>
                                    <p className={`text-sm ${palette.subtle}`}>
                                        Podporované formáty: MP4, MOV, AVI, WebM
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    className="w-full h-full object-contain"
                                    style={{
                                        filter: effects.find((e) => e.id === selectedEffect)?.filter || "none",
                                    }}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                />

                                {/* Text Overlays */}
                                {textOverlays.map((overlay) => (
                                    <div
                                        key={overlay.id}
                                        className="absolute pointer-events-none"
                                        style={{
                                            left: `${overlay.x}%`,
                                            top: `${overlay.y}%`,
                                            fontSize: `${overlay.fontSize}px`,
                                            color: overlay.color,
                                            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {overlay.text}
                                    </div>
                                ))}

                                {/* Playhead indicator */}
                                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-mono">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transport Controls */}
                    {videoUrl && (
                        <div className={`border-t ${palette.border} p-4 ${isDark ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-sm`}>
                            <div className="max-w-5xl mx-auto">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="ghost">
                                            <SkipBack className="h-5 w-5" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            onClick={togglePlayPause}
                                            className={palette.accentButton}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-5 w-5" />
                                            ) : (
                                                <Play className="h-5 w-5 ml-0.5" />
                                            )}
                                        </Button>
                                        <Button size="icon" variant="ghost">
                                            <SkipForward className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="text-sm font-mono w-16 text-right">{formatTime(currentTime)}</span>
                                        <Slider
                                            value={[currentTime]}
                                            max={duration}
                                            step={0.01}
                                            onValueChange={handleSeek}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-mono w-16">{formatTime(duration)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Volume2 className="h-5 w-5" />
                                        <Slider
                                            value={[volume]}
                                            max={1}
                                            step={0.01}
                                            onValueChange={handleVolumeChange}
                                            className="w-24"
                                        />
                                    </div>

                                    {selectedTool === "split" && (
                                        <Button onClick={splitClip} variant="outline">
                                            <Split className="h-4 w-4 mr-2" />
                                            Rozdělit
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Timeline */}
            {videoUrl && (
                <div className={`fixed bottom-0 left-0 right-0 h-48 border-t ${palette.border} ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl z-40`}>
                    <div className="h-full flex flex-col">
                        {/* Timeline Controls */}
                        <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}>
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-mono w-16 text-center">{Math.round(zoom * 100)}%</span>
                                <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(5, zoom + 0.5))}>
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-sm">
                                <span className={palette.muted}>{clips.length} úsek{clips.length !== 1 ? 'y' : ''}</span>
                            </div>
                        </div>

                        {/* Timeline Tracks */}
                        <div ref={timelineRef} className="flex-1 overflow-x-auto overflow-y-hidden">
                            <div className="relative h-full min-w-full" style={{ width: `${getTimelineWidth()}px` }}>
                                {/* Time markers */}
                                <div className={`absolute top-0 left-0 right-0 h-8 border-b ${isDark ? 'border-white/5' : 'border-slate-200'} flex`}>
                                    {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`relative border-l ${isDark ? 'border-white/10' : 'border-slate-300'}`}
                                            style={{ width: `${100 * zoom}px` }}
                                        >
                                            <span className={`absolute top-1 left-1 text-xs ${palette.subtle}`}>
                                                {formatTime(i)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Video track */}
                                <div className="absolute top-8 left-0 right-0 h-16 px-2 py-2">
                                    <div className="relative h-full">
                                        {clips.map((clip) => {
                                            const pos = getClipPosition(clip);
                                            return (
                                                <div
                                                    key={clip.id}
                                                    className={`absolute h-full rounded-lg cursor-pointer transition-all ${
                                                        selectedClipId === clip.id
                                                            ? 'ring-2 ring-indigo-500 bg-gradient-to-r from-indigo-600 to-blue-600'
                                                            : 'bg-gradient-to-r from-indigo-700/80 to-blue-700/80 hover:from-indigo-600/90 hover:to-blue-600/90'
                                                    }`}
                                                    style={{
                                                        left: `${pos.left}px`,
                                                        width: `${pos.width}px`,
                                                    }}
                                                    onClick={() => setSelectedClipId(clip.id)}
                                                >
                                                    <div className="px-3 py-2 h-full flex items-center justify-between text-white text-sm">
                                                        <span className="font-medium truncate">Video clip</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 hover:bg-white/20"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteClip(clip.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Playhead */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-50"
                                    style={{ left: `${currentTime * 100 * zoom}px` }}
                                >
                                    <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
