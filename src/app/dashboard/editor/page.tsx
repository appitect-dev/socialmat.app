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
    thumbnails?: string[];
}

interface TextOverlay {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
}

type DragMode = 'move' | 'trim-start' | 'trim-end' | null;

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
    const [dragMode, setDragMode] = useState<DragMode>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragClipId, setDragClipId] = useState<string | null>(null);
    const [hoveredClipId, setHoveredClipId] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
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
        maxFiles: 1,
    });

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                // When starting playback, ensure we're at start of a clip
                const currentTime = videoRef.current.currentTime;
                const currentClip = clips.find(c => currentTime >= c.start && currentTime < c.end);
                
                if (!currentClip && clips.length > 0) {
                    // Not in any clip, start from first clip
                    videoRef.current.currentTime = clips[0].start;
                }
                
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            setCurrentTime(time);
            
            if (!isPlaying) return;
            
            // Find current clip that contains this time
            const currentClip = clips.find(c => time >= c.start && time < c.end);
            
            // If we're not in any clip, skip to next clip
            if (!currentClip) {
                const nextClip = clips.find(c => c.start > time);
                if (nextClip) {
                    videoRef.current.currentTime = nextClip.start;
                    return;
                } else {
                    // No more clips, stop playback
                    videoRef.current.pause();
                    setIsPlaying(false);
                    if (clips[0]) {
                        videoRef.current.currentTime = clips[0].start;
                    }
                    return;
                }
            }
            
            // If we've reached end of current clip, jump to next
            if (time >= currentClip.end - 0.01) {
                const currentIndex = clips.indexOf(currentClip);
                const nextClip = clips[currentIndex + 1];
                
                if (nextClip) {
                    videoRef.current.currentTime = nextClip.start;
                } else {
                    // End of all clips
                    videoRef.current.pause();
                    setIsPlaying(false);
                    if (clips[0]) {
                        videoRef.current.currentTime = clips[0].start;
                    }
                }
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);
            
            // Create initial clip with full video duration
            const initialClip: VideoClip = {
                id: Date.now().toString(),
                start: 0,
                end: dur,
                duration: dur,
            };
            setClips([initialClip]);
            setSelectedClipId(initialClip.id);
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

        // Pause video during split
        if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }

        const newClip1: VideoClip = {
            ...clip,
            id: clip.id,
            end: currentTime,
            duration: currentTime - clip.start,
        };

        const newClip2: VideoClip = {
            id: Date.now().toString(),
            start: currentTime,
            end: clip.end,
            duration: clip.end - currentTime,
        };

        const clipIndex = clips.findIndex(c => c.id === selectedClipId);
        const newClips = [...clips];
        newClips[clipIndex] = newClip1;
        newClips.splice(clipIndex + 1, 0, newClip2);
        
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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Space = play/pause
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                togglePlayPause();
            }
            // Delete = delete selected clip
            if ((e.code === 'Delete' || e.code === 'Backspace') && selectedClipId && clips.length > 1) {
                e.preventDefault();
                deleteClip(selectedClipId);
            }
            // Arrow keys = seek
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                handleSeek([Math.max(0, currentTime - 0.1)]);
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                handleSeek([Math.min(duration, currentTime + 0.1)]);
            }
            // S = split
            if (e.code === 'KeyS' && selectedClipId) {
                e.preventDefault();
                splitClip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTime, duration, selectedClipId, clips]);

    // Generate thumbnails for clip
    const generateThumbnails = async (clip: VideoClip): Promise<string[]> => {
        if (!videoRef.current || !canvasRef.current) return [];
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [];

        canvas.width = 160;
        canvas.height = 90;

        const thumbnails: string[] = [];
        const numThumbs = Math.min(Math.ceil(clip.duration), 20); // Max 20 thumbnails
        
        for (let i = 0; i < numThumbs; i++) {
            const time = clip.start + (i / numThumbs) * clip.duration;
            video.currentTime = time;
            
            await new Promise(resolve => {
                video.onseeked = resolve;
            });

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            thumbnails.push(canvas.toDataURL('image/jpeg', 0.5));
        }

        return thumbnails;
    };

    const getTimelineWidth = () => {
        if (clips.length === 0) return 2000;
        
        // Calculate total duration of all clips combined
        const totalDuration = clips.reduce((sum, clip) => sum + (clip.end - clip.start), 0);
        return Math.max(totalDuration * zoom * 100, 2000); // minimum 2000px
    };

    const getClipPosition = (clip: VideoClip, index: number, allClips: VideoClip[]) => {
        const pixelsPerSecond = 100 * zoom;
        
        // Calculate position based on order in array, not timestamps
        let leftPosition = 0;
        for (let i = 0; i < index; i++) {
            leftPosition += (allClips[i].end - allClips[i].start) * pixelsPerSecond;
        }
        
        return {
            left: leftPosition,
            width: Math.max((clip.end - clip.start) * pixelsPerSecond, 50), // minimum 50px
        };
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current || selectedTool !== "split" || dragMode) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
        
        // Find which clip was clicked based on sequential positions
        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            const pos = getClipPosition(clip, i, clips);
            
            if (clickX >= pos.left && clickX <= pos.left + pos.width) {
                // Clicked inside this clip
                const relativeX = clickX - pos.left;
                const pixelsPerSecond = 100 * zoom;
                const relativeTime = relativeX / pixelsPerSecond;
                const clickTime = clip.start + relativeTime;
                
                if (videoRef.current) {
                    videoRef.current.currentTime = clickTime;
                    setCurrentTime(clickTime);
                }
                break;
            }
        }
    };

    const handleTrimStart = (clipId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragMode('trim-start');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    };

    const handleTrimEnd = (clipId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragMode('trim-end');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    };

    const handleClipDragStart = (clipId: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('trim-handle')) return;
        e.stopPropagation();
        setDragMode('move');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragMode || !dragClipId) return;

        const deltaX = e.clientX - dragStartX;
        const pixelsPerSecond = 100 * zoom;
        const deltaTime = deltaX / pixelsPerSecond;

        const clip = clips.find(c => c.id === dragClipId);
        if (!clip) return;

        if (dragMode === 'trim-start') {
            const newStart = Math.max(0, Math.min(clip.end - 0.1, clip.start + deltaTime));
            setClips(clips.map(c => 
                c.id === dragClipId 
                    ? { ...c, start: newStart, duration: c.end - newStart }
                    : c
            ));
            setDragStartX(e.clientX);
        } else if (dragMode === 'trim-end') {
            const newEnd = Math.min(duration, Math.max(clip.start + 0.1, clip.end + deltaTime));
            setClips(clips.map(c => 
                c.id === dragClipId 
                    ? { ...c, end: newEnd, duration: newEnd - c.start }
                    : c
            ));
            setDragStartX(e.clientX);
        } else if (dragMode === 'move') {
            // For reordering, we'll detect when mouse is over another clip
            const rect = timelineRef.current?.getBoundingClientRect();
            if (!rect) return;
            
            const clickX = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
            const hoveredClipIndex = clips.findIndex((c, idx) => {
                const pos = getClipPosition(c, idx, clips);
                return clickX >= pos.left && clickX <= pos.left + pos.width;
            });
            
            if (hoveredClipIndex !== -1) {
                const draggedIndex = clips.findIndex(c => c.id === dragClipId);
                if (draggedIndex !== hoveredClipIndex && draggedIndex !== -1) {
                    // Reorder clips
                    const newClips = [...clips];
                    const [draggedClip] = newClips.splice(draggedIndex, 1);
                    newClips.splice(hoveredClipIndex, 0, draggedClip);
                    setClips(newClips);
                }
            }
        }
    };

    const handleMouseUp = () => {
        setDragMode(null);
        setDragClipId(null);
    };

    return (
        <div className={`min-h-screen ${palette.page}`}>
            {/* Top Toolbar */}
            <div className={`sticky top-0 z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${palette.border}`}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">Video Editor</h1>
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <Button variant="ghost" size="icon" className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}>
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}>
                            <Redo className="h-4 w-4" />
                        </Button>
                        <div className={`h-6 w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                        <span className={`text-xs ${palette.subtle}`}>
                            ⌨️ Space=Play | S=Split | Del=Remove | ←→=Seek
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}>
                            <Settings className="h-4 w-4 mr-2" />
                            Nastavení
                        </Button>
                        <Button className={`${palette.accentButton} ${palette.accentButtonHover}`}>
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
                            <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>Nástroje</h3>
                            <div className="space-y-1">
                                <Button
                                    variant={selectedTool === "select" ? "default" : "ghost"}
                                    className={`w-full justify-start ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("select")}
                                >
                                    <Layers className="h-4 w-4 mr-2" />
                                    Výběr
                                </Button>
                                <Button
                                    variant={selectedTool === "split" ? "default" : "ghost"}
                                    className={`w-full justify-start ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("split")}
                                >
                                    <Scissors className="h-4 w-4 mr-2" />
                                    Střih
                                </Button>
                                <Button
                                    variant={selectedTool === "text" ? "default" : "ghost"}
                                    className={`w-full justify-start ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("text")}
                                >
                                    <Type className="h-4 w-4 mr-2" />
                                    Text
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>Efekty</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {effects.slice(0, 6).map((effect) => (
                                    <Button
                                        key={effect.id}
                                        variant={selectedEffect === effect.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedEffect(effect.id)}
                                        className={`text-xs h-8 ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}`}
                                    >
                                        {effect.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>Rychlost</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[0.5, 1, 2].map((speed) => (
                                    <Button
                                        key={speed}
                                        variant={playbackSpeed === speed ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPlaybackSpeed(speed)}
                                        className={`h-8 ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}`}
                                    >
                                        {speed}x
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {selectedTool === "text" && (
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>Textové vrstvy</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`w-full ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}`}
                                    onClick={addTextOverlay}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Přidat text
                                </Button>
                                <div className="mt-3 space-y-2">
                                    {textOverlays.map((overlay) => (
                                        <Card key={overlay.id} className="p-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs truncate flex-1">{overlay.text}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-6 w-6 flex-shrink-0 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
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

                                {/* Hidden canvas for thumbnail generation */}
                                <canvas ref={canvasRef} className="hidden" />

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
                                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-mono flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                                    {(() => {
                                        const currentClip = clips.find(c => currentTime >= c.start && currentTime < c.end);
                                        if (currentClip) {
                                            const clipIndex = clips.indexOf(currentClip);
                                            return <span className="text-xs opacity-75">• Clip {clipIndex + 1}</span>;
                                        }
                                        return null;
                                    })()}
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
                                        <Button size="icon" variant="ghost" className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}>
                                            <SkipBack className="h-5 w-5" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            onClick={togglePlayPause}
                                            className={`${palette.accentButton} ${palette.accentButtonHover}`}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-5 w-5" />
                                            ) : (
                                                <Play className="h-5 w-5 ml-0.5" />
                                            )}
                                        </Button>
                                        <Button size="icon" variant="ghost" className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}>
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
                                        <Button onClick={splitClip} variant="outline" className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}>
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
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
                                    className={`h-8 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-mono w-20 text-center font-semibold">
                                    {Math.round(zoom * 100)}% zoom
                                </span>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setZoom(Math.min(5, zoom + 0.5))}
                                    className={`h-8 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedTool === "split" && (
                                    <span className={`text-xs ${palette.muted} italic`}>
                                        💡 Klikni na clip a stiskni S pro rozdělení
                                    </span>
                                )}
                                <span className={`text-sm font-medium ${palette.muted}`}>
                                    {clips.length} {clips.length === 1 ? 'úsek' : clips.length < 5 ? 'úseky' : 'úseků'} • {formatTime(clips.reduce((sum, c) => sum + (c.end - c.start), 0))} celkem
                                </span>
                            </div>
                        </div>

                        {/* Timeline Tracks */}
                        <div 
                            ref={timelineRef} 
                            className="flex-1 overflow-x-auto overflow-y-hidden cursor-crosshair"
                            onClick={handleTimelineClick}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div className="relative h-full min-w-full" style={{ width: `${getTimelineWidth()}px` }}>
                                {/* Time markers */}
                                <div className={`absolute top-0 left-0 right-0 h-8 border-b ${isDark ? 'border-white/5' : 'border-slate-200'} flex`}>
                                    {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`relative border-l ${isDark ? 'border-white/10' : 'border-slate-300'}`}
                                            style={{ width: `${100 * zoom}px` }}
                                        >
                                            <span className={`absolute top-1 left-1 text-xs font-mono ${palette.subtle}`}>
                                                {formatTime(i)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Video track */}
                                <div className="absolute top-10 left-0 right-0 h-20 px-2">
                                    <div className={`text-xs font-medium mb-1 ${palette.muted}`}>Video Track</div>
                                    <div className="relative h-16">
                                        {clips.map((clip, index) => {
                                            const pos = getClipPosition(clip, index, clips);
                                            const isSelected = selectedClipId === clip.id;
                                            const isHovered = hoveredClipId === clip.id;
                                            const isDragging = dragClipId === clip.id && dragMode === 'move';
                                            return (
                                                <div
                                                    key={clip.id}
                                                    className={`absolute h-full rounded cursor-move transition-all overflow-hidden group ${
                                                        isSelected
                                                            ? 'ring-2 ring-indigo-400 shadow-lg z-10'
                                                            : isHovered 
                                                            ? 'ring-2 ring-indigo-400/50' 
                                                            : ''
                                                    } ${isDragging ? 'opacity-70' : ''}`}
                                                    style={{
                                                        left: `${pos.left}px`,
                                                        width: `${pos.width}px`,
                                                        background: isSelected 
                                                            ? 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)'
                                                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%)',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedClipId(clip.id);
                                                    }}
                                                    onMouseDown={(e) => handleClipDragStart(clip.id, e)}
                                                    onMouseEnter={() => setHoveredClipId(clip.id)}
                                                    onMouseLeave={() => setHoveredClipId(null)}
                                                >
                                                    {/* Trim handle - START */}
                                                    <div
                                                        className="trim-handle absolute left-0 top-0 bottom-0 w-2 bg-yellow-400 cursor-ew-resize hover:w-3 transition-all z-20 opacity-0 group-hover:opacity-100"
                                                        onMouseDown={(e) => handleTrimStart(clip.id, e)}
                                                        style={{ touchAction: 'none' }}
                                                    >
                                                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-yellow-600" />
                                                    </div>

                                                    {/* Clip content */}
                                                    <div className="px-3 h-full flex items-center justify-between text-white pointer-events-none">
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="font-semibold text-sm truncate">Clip {index + 1}</span>
                                                            <span className="text-xs opacity-90 font-mono">
                                                                {formatTime(clip.start)} - {formatTime(clip.end)}
                                                            </span>
                                                        </div>
                                                        {clips.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 hover:bg-white/20 flex-shrink-0 ml-2 pointer-events-auto"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteClip(clip.id);
                                                                }}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {/* Trim handle - END */}
                                                    <div
                                                        className="trim-handle absolute right-0 top-0 bottom-0 w-2 bg-yellow-400 cursor-ew-resize hover:w-3 transition-all z-20 opacity-0 group-hover:opacity-100"
                                                        onMouseDown={(e) => handleTrimEnd(clip.id, e)}
                                                        style={{ touchAction: 'none' }}
                                                    >
                                                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-yellow-600" />
                                                    </div>

                                                    {/* Duration indicator on hover */}
                                                    {isHovered && (
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                                                            {formatTime(clip.duration)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Playhead */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-50"
                                    style={{ 
                                        left: `${(() => {
                                            // Calculate playhead position in sequential timeline
                                            let position = 0;
                                            const sortedClips = [...clips].sort((a, b) => a.start - b.start);
                                            
                                            for (const clip of sortedClips) {
                                                if (currentTime >= clip.start && currentTime <= clip.end) {
                                                    // Inside this clip
                                                    const clipIndex = clips.findIndex(c => c.id === clip.id);
                                                    const clipPos = getClipPosition(clip, clipIndex, clips);
                                                    const relativeTime = currentTime - clip.start;
                                                    const pixelsPerSecond = 100 * zoom;
                                                    position = clipPos.left + (relativeTime * pixelsPerSecond);
                                                    break;
                                                }
                                            }
                                            
                                            return position;
                                        })()}px` 
                                    }}
                                >
                                    <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
                                    <div className="absolute top-3 -left-3 w-6 h-6 bg-red-500/20 rounded-full animate-ping" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
