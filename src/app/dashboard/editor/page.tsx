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

interface VideoSource {
    id: string;
    file: File;
    url: string;
    duration: number;
}

interface VideoClip {
    id: string;
    sourceId: string; // Reference to VideoSource
    sourceStart: number; // Start time in source video
    sourceEnd: number; // End time in source video
    timelineStart: number; // Start position on timeline
    timelineEnd: number; // End position on timeline
    duration: number; // Duration of clip
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

    const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
    const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
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

    // History for undo/redo
    const [history, setHistory] = useState<VideoClip[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Track pending video source change
    const [pendingClipId, setPendingClipId] = useState<string | null>(null);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Save current state to history
    const saveToHistory = (newClips: VideoClip[]) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(JSON.parse(JSON.stringify(newClips)));
            // Keep max 50 history states
            if (newHistory.length > 50) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
        setClips(newClips);
    };

    // Undo function
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setClips(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        }
    };

    // Redo function
    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setClips(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const sourceId = Date.now().toString() + Math.random();
            const url = URL.createObjectURL(file);

            // Create a temporary video element to get duration
            const tempVideo = document.createElement('video');
            tempVideo.src = url;
            tempVideo.onloadedmetadata = () => {
                const newSource: VideoSource = {
                    id: sourceId,
                    file,
                    url,
                    duration: tempVideo.duration,
                };

                setVideoSources(prev => {
                    const updated = [...prev, newSource];

                    // If this is the first video, set it as active
                    if (prev.length === 0) {
                        setVideoFile(file);
                        setVideoUrl(url);
                        setActiveSourceId(sourceId);
                        setDuration(tempVideo.duration);
                    } else {
                        // Add as new clip at the end of timeline
                        // Calculate timeline end position from existing clips
                        const timelineEnd = clips.reduce((max, clip) =>
                            Math.max(max, clip.timelineEnd), 0
                        );

                        const newClip: VideoClip = {
                            id: Date.now().toString() + Math.random(),
                            sourceId: sourceId,
                            sourceStart: 0, // Start from beginning of this video
                            sourceEnd: tempVideo.duration, // Full duration of this video
                            timelineStart: timelineEnd, // Start after last clip
                            timelineEnd: timelineEnd + tempVideo.duration, // End based on duration
                            duration: tempVideo.duration,
                        };

                        saveToHistory([...clips, newClip]);
                    }

                    return updated;
                });
            };
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".avi", ".webm"],
        },
        multiple: true,
    });

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                // When starting playback, ensure we're at start of a clip
                const videoTime = videoRef.current.currentTime;
                const currentClip = clips.find(c =>
                    c.sourceId === activeSourceId &&
                    videoTime >= c.sourceStart &&
                    videoTime < c.sourceEnd
                );

                if (!currentClip && clips.length > 0) {
                    // Not in any clip, start from first clip
                    const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                    const firstClip = sortedClips[0];

                    // Check if we need to switch video
                    if (firstClip.sourceId !== activeSourceId) {
                        const firstSource = videoSources.find(s => s.id === firstClip.sourceId);
                        if (firstSource) {
                            setShouldAutoPlay(true);
                            setPendingClipId(firstClip.id);
                            setVideoUrl(firstSource.url);
                            setVideoFile(firstSource.file);
                            setActiveSourceId(firstSource.id);
                            setDuration(firstSource.duration);
                            setSelectedClipId(firstClip.id);
                            return;
                        }
                    }

                    videoRef.current.currentTime = firstClip.sourceStart;
                }

                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const videoTime = videoRef.current.currentTime;

            if (!isPlaying) return;

            // Find current clip based on active source and video time
            const currentClip = clips.find(c =>
                c.sourceId === activeSourceId &&
                videoTime >= c.sourceStart &&
                videoTime < c.sourceEnd
            );

            if (currentClip) {
                // Update timeline current time based on clip position
                const offsetInClip = videoTime - currentClip.sourceStart;
                const timelineTime = currentClip.timelineStart + offsetInClip;
                setCurrentTime(timelineTime);

                // Check if we reached end of current clip
                if (videoTime >= currentClip.sourceEnd - 0.05) {
                    // Find next clip on timeline
                    const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                    const currentIndex = sortedClips.findIndex(c => c.id === currentClip.id);
                    const nextClip = sortedClips[currentIndex + 1];

                    if (nextClip) {
                        // Switch to next clip
                        const nextSource = videoSources.find(s => s.id === nextClip.sourceId);

                        if (nextSource && nextSource.id !== activeSourceId) {
                            // Different video source - switch video
                            setShouldAutoPlay(true);
                            setPendingClipId(nextClip.id);
                            setVideoUrl(nextSource.url);
                            setVideoFile(nextSource.file);
                            setActiveSourceId(nextSource.id);
                            setDuration(nextSource.duration);
                        } else {
                            // Same video source - just jump to next clip start
                            videoRef.current.currentTime = nextClip.sourceStart;
                        }
                        setSelectedClipId(nextClip.id);
                    } else {
                        // No more clips - stop
                        videoRef.current.pause();
                        setIsPlaying(false);
                        // Go back to first clip
                        if (sortedClips[0]) {
                            const firstSource = videoSources.find(s => s.id === sortedClips[0].sourceId);
                            if (firstSource && firstSource.id !== activeSourceId) {
                                setVideoUrl(firstSource.url);
                                setVideoFile(firstSource.file);
                                setActiveSourceId(firstSource.id);
                                setDuration(firstSource.duration);
                            }
                            setSelectedClipId(sortedClips[0].id);
                            setCurrentTime(0);
                        }
                    }
                }
            } else {
                // Not in any clip - find next clip and jump to it
                const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                const nextClip = sortedClips.find(c => c.sourceId === activeSourceId && c.sourceStart > videoTime);

                if (nextClip) {
                    videoRef.current.currentTime = nextClip.sourceStart;
                    setSelectedClipId(nextClip.id);
                } else {
                    // No more clips in this video, check if there's a clip in another video
                    const nextAnyClip = sortedClips.find(c => c.sourceId !== activeSourceId);
                    if (nextAnyClip) {
                        const nextSource = videoSources.find(s => s.id === nextAnyClip.sourceId);
                        if (nextSource) {
                            setShouldAutoPlay(true);
                            setPendingClipId(nextAnyClip.id);
                            setVideoUrl(nextSource.url);
                            setVideoFile(nextSource.file);
                            setActiveSourceId(nextSource.id);
                            setDuration(nextSource.duration);
                            setSelectedClipId(nextAnyClip.id);
                        }
                    } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    }
                }
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current && activeSourceId) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            // Create initial clip with full video duration only if no clips exist
            if (clips.length === 0) {
                const initialClip: VideoClip = {
                    id: Date.now().toString(),
                    sourceId: activeSourceId,
                    sourceStart: 0,
                    sourceEnd: dur,
                    timelineStart: 0,
                    timelineEnd: dur,
                    duration: dur,
                };
                saveToHistory([initialClip]);
                setSelectedClipId(initialClip.id);
            }

            // Handle pending clip change (from video source switch)
            if (pendingClipId) {
                const pendingClip = clips.find(c => c.id === pendingClipId);
                if (pendingClip && videoRef.current) {
                    videoRef.current.currentTime = pendingClip.sourceStart;
                    setCurrentTime(pendingClip.timelineStart);

                    if (shouldAutoPlay) {
                        videoRef.current.play().then(() => {
                            setIsPlaying(true);
                        }).catch(err => {
                            console.error('Auto-play failed:', err);
                            setIsPlaying(false);
                        });
                        setShouldAutoPlay(false);
                    }
                    setPendingClipId(null);
                }
            }
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            const targetTimelineTime = value[0];
            // Find which clip contains this timeline time
            const targetClip = clips.find(c =>
                targetTimelineTime >= c.timelineStart && targetTimelineTime < c.timelineEnd
            );

            if (targetClip) {
                // Calculate position within clip and map to source time
                const offsetInClip = targetTimelineTime - targetClip.timelineStart;
                const sourceTime = targetClip.sourceStart + offsetInClip;

                // Check if we need to switch video source
                const targetSource = videoSources.find(s => s.id === targetClip.sourceId);
                if (targetSource && targetSource.id !== activeSourceId) {
                    setVideoUrl(targetSource.url);
                    setVideoFile(targetSource.file);
                    setActiveSourceId(targetSource.id);
                    setDuration(targetSource.duration);
                    setPendingClipId(targetClip.id);
                    // Don't auto-play when seeking
                    setShouldAutoPlay(false);
                } else {
                    videoRef.current.currentTime = sourceTime;
                }

                setCurrentTime(targetTimelineTime);
                setSelectedClipId(targetClip.id);
            } else {
                // Time is in a gap, find nearest clip
                const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                const nextClip = sortedClips.find(c => c.timelineStart >= targetTimelineTime);

                if (nextClip) {
                    const nextSource = videoSources.find(s => s.id === nextClip.sourceId);
                    if (nextSource && nextSource.id !== activeSourceId) {
                        setVideoUrl(nextSource.url);
                        setVideoFile(nextSource.file);
                        setActiveSourceId(nextSource.id);
                        setDuration(nextSource.duration);
                        setPendingClipId(nextClip.id);
                        setShouldAutoPlay(false);
                    } else {
                        videoRef.current.currentTime = nextClip.sourceStart;
                    }
                    setCurrentTime(nextClip.timelineStart);
                    setSelectedClipId(nextClip.id);
                }
            }
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
        if (!selectedClipId || !videoRef.current) return;

        const clip = clips.find(c => c.id === selectedClipId);
        if (!clip) return;

        // Current time is timeline time, need to convert to source time
        const videoTime = videoRef.current.currentTime;

        // Check if we're within the clip bounds
        if (videoTime <= clip.sourceStart || videoTime >= clip.sourceEnd) return;

        // Pause video during split
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }

        // Calculate where we are in the clip
        const offsetInClip = videoTime - clip.sourceStart;
        const timelineSplitPoint = clip.timelineStart + offsetInClip;

        const newClip1: VideoClip = {
            ...clip,
            id: clip.id,
            sourceEnd: videoTime,
            timelineEnd: timelineSplitPoint,
            duration: videoTime - clip.sourceStart,
        };

        const newClip2: VideoClip = {
            id: Date.now().toString(),
            sourceId: clip.sourceId,
            sourceStart: videoTime,
            sourceEnd: clip.sourceEnd,
            timelineStart: timelineSplitPoint,
            timelineEnd: clip.timelineEnd,
            duration: clip.sourceEnd - videoTime,
        };

        const clipIndex = clips.findIndex(c => c.id === selectedClipId);
        const newClips = [...clips];
        newClips[clipIndex] = newClip1;
        newClips.splice(clipIndex + 1, 0, newClip2);

        saveToHistory(newClips);
        setSelectedClipId(newClip2.id);
    };

    const deleteClip = (clipId: string) => {
        const newClips = clips.filter(c => c.id !== clipId);
        saveToHistory(newClips);
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

    // Switch video source when selected clip changes
    useEffect(() => {
        if (selectedClipId && videoRef.current) {
            const selectedClip = clips.find(c => c.id === selectedClipId);
            if (selectedClip) {
                const source = videoSources.find(s => s.id === selectedClip.sourceId);
                if (source && source.url !== videoUrl) {
                    const wasPlaying = isPlaying;
                    const currentClipTime = currentTime;

                    // Switch video source
                    setVideoUrl(source.url);
                    setVideoFile(source.file);
                    setActiveSourceId(source.id);
                    setDuration(source.duration);

                    // Wait for video to load then restore playback state
                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = selectedClip.sourceStart;
                            setCurrentTime(selectedClip.timelineStart);
                            if (wasPlaying) {
                                videoRef.current.play();
                            }
                        }
                    };
                }
            }
        }
    }, [selectedClipId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }
            // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
            if (((e.ctrlKey || e.metaKey) && e.code === 'KeyY') ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyZ')) {
                e.preventDefault();
                redo();
                return;
            }
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
            // Arrow keys = seek within current clip or jump to next/prev clip
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                const currentClip = clips.find(c => currentTime >= c.timelineStart && currentTime < c.timelineEnd);
                if (currentClip) {
                    const newTime = Math.max(currentClip.timelineStart, currentTime - 0.5);
                    if (newTime > currentClip.timelineStart) {
                        handleSeek([newTime]);
                    } else {
                        // Jump to previous clip
                        const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                        const currentIndex = sortedClips.findIndex(c => c.id === currentClip.id);
                        if (currentIndex > 0) {
                            const prevClip = sortedClips[currentIndex - 1];
                            handleSeek([prevClip.timelineEnd - 0.1]);
                        }
                    }
                }
            }
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                const currentClip = clips.find(c => currentTime >= c.timelineStart && currentTime < c.timelineEnd);
                if (currentClip) {
                    const newTime = Math.min(currentClip.timelineEnd - 0.01, currentTime + 0.5);
                    if (newTime < currentClip.timelineEnd - 0.01) {
                        handleSeek([newTime]);
                    } else {
                        // Jump to next clip
                        const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                        const currentIndex = sortedClips.findIndex(c => c.id === currentClip.id);
                        if (currentIndex < clips.length - 1) {
                            const nextClip = sortedClips[currentIndex + 1];
                            handleSeek([nextClip.timelineStart]);
                        }
                    }
                }
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
            const time = clip.sourceStart + (i / numThumbs) * clip.duration;
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

        // Calculate total timeline duration (max timelineEnd)
        const totalDuration = clips.reduce((max, clip) => Math.max(max, clip.timelineEnd), 0);
        return Math.max(totalDuration * zoom * 100, 2000); // minimum 2000px
    };

    const getClipPosition = (clip: VideoClip, index: number, allClips: VideoClip[]) => {
        const pixelsPerSecond = 100 * zoom;

        // Position based on timeline start/end
        return {
            left: clip.timelineStart * pixelsPerSecond,
            width: Math.max((clip.timelineEnd - clip.timelineStart) * pixelsPerSecond, 50), // minimum 50px
        };
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current || selectedTool !== "split" || dragMode) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;

        // Find which clip was clicked
        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            const pos = getClipPosition(clip, i, clips);

            if (clickX >= pos.left && clickX <= pos.left + pos.width) {
                // Clicked inside this clip
                const relativeX = clickX - pos.left;
                const pixelsPerSecond = 100 * zoom;
                const relativeTime = relativeX / pixelsPerSecond;
                const timelineTime = clip.timelineStart + relativeTime;
                const sourceTime = clip.sourceStart + relativeTime;

                // Switch video if needed
                if (clip.sourceId !== activeSourceId) {
                    const clipSource = videoSources.find(s => s.id === clip.sourceId);
                    if (clipSource) {
                        setVideoUrl(clipSource.url);
                        setVideoFile(clipSource.file);
                        setActiveSourceId(clipSource.id);
                        setDuration(clipSource.duration);
                        setPendingClipId(clip.id);
                        setShouldAutoPlay(false);
                    }
                }

                if (videoRef.current) {
                    videoRef.current.currentTime = sourceTime;
                    setCurrentTime(timelineTime);
                }
                setSelectedClipId(clip.id);
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
            const newSourceStart = Math.max(0, Math.min(clip.sourceEnd - 0.1, clip.sourceStart + deltaTime));
            const newDuration = clip.sourceEnd - newSourceStart;
            const timelineDiff = newSourceStart - clip.sourceStart;

            const newClips = clips.map(c =>
                c.id === dragClipId
                    ? {
                        ...c,
                        sourceStart: newSourceStart,
                        timelineStart: c.timelineStart + timelineDiff,
                        duration: newDuration
                    }
                    : c
            );
            setClips(newClips);
            setDragStartX(e.clientX);
        } else if (dragMode === 'trim-end') {
            const source = videoSources.find(s => s.id === clip.sourceId);
            const maxEnd = source ? source.duration : duration;
            const newSourceEnd = Math.min(maxEnd, Math.max(clip.sourceStart + 0.1, clip.sourceEnd + deltaTime));
            const newDuration = newSourceEnd - clip.sourceStart;
            const timelineDiff = newSourceEnd - clip.sourceEnd;

            const newClips = clips.map(c =>
                c.id === dragClipId
                    ? {
                        ...c,
                        sourceEnd: newSourceEnd,
                        timelineEnd: c.timelineEnd + timelineDiff,
                        duration: newDuration
                    }
                    : c
            );
            setClips(newClips);
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
        // Save to history on mouse up after dragging
        if (dragMode && dragClipId) {
            saveToHistory(clips);
        }
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
                        {videoFile && (
                            <div {...getRootProps()} className="inline-block">
                                <input {...getInputProps()} />
                                <Button variant="outline" size="sm" className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Přidat video
                                </Button>
                            </div>
                        )}
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
                                    className={`w-full justify-start font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("select")}
                                    style={!isDark && selectedTool !== "select" ? { color: '#0f172a' } : undefined}
                                >
                                    <Layers className="h-4 w-4 mr-2" />
                                    Výběr
                                </Button>
                                <Button
                                    variant={selectedTool === "split" ? "default" : "ghost"}
                                    className={`w-full justify-start font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("split")}
                                    style={!isDark && selectedTool !== "split" ? { color: '#0f172a' } : undefined}
                                >
                                    <Scissors className="h-4 w-4 mr-2" />
                                    Střih
                                </Button>
                                <Button
                                    variant={selectedTool === "text" ? "default" : "ghost"}
                                    className={`w-full justify-start font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTool("text")}
                                    style={!isDark && selectedTool !== "text" ? { color: '#0f172a' } : undefined}
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
                                        className={`text-xs h-8 font-medium ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 bg-white hover:bg-slate-100'}`}
                                        style={!isDark && selectedEffect !== effect.id ? { color: '#0f172a', borderColor: '#cbd5e1' } : undefined}
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
                                        className={`h-8 font-medium ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 bg-white hover:bg-slate-100'}`}
                                        style={!isDark && playbackSpeed !== speed ? { color: '#0f172a', borderColor: '#cbd5e1' } : undefined}
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
                                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${isDragActive
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
                                    <span>
                                        {formatTime(currentTime)} / {formatTime(clips.reduce((max, c) => Math.max(max, c.timelineEnd), 0))}
                                    </span>
                                    {(() => {
                                        const currentClip = clips.find(c => currentTime >= c.timelineStart && currentTime < c.timelineEnd);
                                        if (currentClip) {
                                            const clipIndex = clips.indexOf(currentClip);
                                            return <span className="text-xs opacity-75">• Clip {clipIndex + 1}/{clips.length}</span>;
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
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={undo}
                                            disabled={historyIndex <= 0}
                                            className={isDark ? 'text-white hover:bg-white/10 disabled:opacity-30' : 'text-slate-900 hover:bg-slate-100 disabled:opacity-30'}
                                            title="Undo (Ctrl+Z)"
                                        >
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
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={redo}
                                            disabled={historyIndex >= history.length - 1}
                                            className={isDark ? 'text-white hover:bg-white/10 disabled:opacity-30' : 'text-slate-900 hover:bg-slate-100 disabled:opacity-30'}
                                            title="Redo (Ctrl+Y)"
                                        >
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
                                        <span className="text-sm font-mono w-16">
                                            {formatTime(clips.reduce((max, c) => Math.max(max, c.timelineEnd), 0))}
                                        </span>
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
                                    {clips.length} {clips.length === 1 ? 'úsek' : clips.length < 5 ? 'úseky' : 'úseků'} • {formatTime(clips.reduce((max, c) => Math.max(max, c.timelineEnd), 0))} celkem
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
                                                    className={`absolute h-full rounded cursor-move transition-all overflow-hidden group ${isSelected
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
                                                                {formatTime(clip.sourceStart)} - {formatTime(clip.sourceEnd)}
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
                                            // Calculate playhead position in timeline
                                            const pixelsPerSecond = 100 * zoom;
                                            return currentTime * pixelsPerSecond;
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
