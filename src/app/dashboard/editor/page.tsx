"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    Wand2,
    Music,
    Volume1,
    VolumeX,
    X,
    Loader2,
    Sparkles,
    Sun,
    AudioLines,
    Film,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useDashboardTheme } from "@/components/dashboard-theme";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface VideoSource {
    id: string;
    file: File;
    url: string;
    duration: number;
    name: string;
}

interface VideoClip {
    id: string;
    sourceId: string;
    sourceStart: number;
    sourceEnd: number;
    timelineStart: number;
    timelineEnd: number;
    duration: number;
    thumbnails?: string[];
    transition?: TransitionType;
}

interface TextOverlay {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
}

interface AudioTrack {
    id: string;
    name: string;
    url: string;
    file: File;
    volume: number;
    startTime: number;
    duration: number;
}

interface ExportSettings {
    format: 'mp4' | 'webm' | 'mov';
    quality: '360p' | '720p' | '1080p' | '4k';
    fps: 24 | 30 | 60;
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
}

type DragMode = 'move' | 'trim-start' | 'trim-end' | null;
type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'wipe';

const QUALITY_PRESETS = {
    '360p': { width: 640, height: 360, bitrate: '1M' },
    '720p': { width: 1280, height: 720, bitrate: '5M' },
    '1080p': { width: 1920, height: 1080, bitrate: '10M' },
    '4k': { width: 3840, height: 2160, bitrate: '35M' },
};

const ASPECT_RATIOS = {
    '16:9': { label: 'YouTube/Landscape', ratio: 16 / 9 },
    '9:16': { label: 'TikTok/Reels/Stories', ratio: 9 / 16 },
    '1:1': { label: 'Instagram Post', ratio: 1 },
    '4:5': { label: 'Instagram Portrait', ratio: 4 / 5 },
};

const AI_FEATURES = [
    { id: 'remove-silence', name: 'Odstranit ticho', description: 'Automaticky odstraní tiché pasáže', icon: AudioLines },
    { id: 'auto-color', name: 'Vylepšit barvy', description: 'AI automaticky upraví barvy a kontrast', icon: Sun },
    { id: 'stabilize', name: 'Stabilizovat', description: 'Odstranit roztřesení videa', icon: Film },
    { id: 'enhance-audio', name: 'Vyčistit zvuk', description: 'Odstranit šum a zlepšit kvalitu', icon: Volume2 },
];

const TRANSITIONS: { id: TransitionType; name: string }[] = [
    { id: 'none', name: 'Žádný' },
    { id: 'fade', name: 'Prolínání' },
    { id: 'slide', name: 'Posunutí' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'wipe', name: 'Stírání' },
];

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

    // Audio tracks
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

    // Export modal
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSettings, setExportSettings] = useState<ExportSettings>({
        format: 'mp4',
        quality: '1080p',
        fps: 30,
        aspectRatio: '16:9',
    });
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // AI features
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [processingAI, setProcessingAI] = useState<string | null>(null);

    // History for undo/redo
    const [history, setHistory] = useState<VideoClip[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Track pending video source change
    const [pendingClipId, setPendingClipId] = useState<string | null>(null);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Save current state to history
    const saveToHistory = useCallback((newClips: VideoClip[]) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(JSON.parse(JSON.stringify(newClips)));
            if (newHistory.length > 50) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
        setClips(newClips);
    }, [historyIndex]);

    // Undo function
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setClips(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        }
    }, [historyIndex, history]);

    // Redo function
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setClips(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        }
    }, [historyIndex, history]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const sourceId = Date.now().toString() + Math.random();
            const url = URL.createObjectURL(file);

            const tempVideo = document.createElement('video');
            tempVideo.src = url;
            tempVideo.onloadedmetadata = () => {
                const newSource: VideoSource = {
                    id: sourceId,
                    file,
                    url,
                    duration: tempVideo.duration,
                    name: file.name,
                };

                setVideoSources(prev => {
                    const updated = [...prev, newSource];

                    if (prev.length === 0) {
                        setVideoFile(file);
                        setVideoUrl(url);
                        setActiveSourceId(sourceId);
                        setDuration(tempVideo.duration);
                    } else {
                        const timelineEnd = clips.reduce((max, clip) =>
                            Math.max(max, clip.timelineEnd), 0
                        );

                        const newClip: VideoClip = {
                            id: Date.now().toString() + Math.random(),
                            sourceId: sourceId,
                            sourceStart: 0,
                            sourceEnd: tempVideo.duration,
                            timelineStart: timelineEnd,
                            timelineEnd: timelineEnd + tempVideo.duration,
                            duration: tempVideo.duration,
                            transition: 'none',
                        };

                        saveToHistory([...clips, newClip]);
                    }

                    return updated;
                });
            };
        });
    }, [clips, saveToHistory]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".avi", ".webm"],
        },
        multiple: true,
    });

    // Audio file drop handler
    const onAudioDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);

            audio.onloadedmetadata = () => {
                const newTrack: AudioTrack = {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    url,
                    file,
                    volume: 1,
                    startTime: 0,
                    duration: audio.duration,
                };
                setAudioTracks(prev => [...prev, newTrack]);
            };
        });
    }, []);

    const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } = useDropzone({
        onDrop: onAudioDrop,
        accept: {
            "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
        },
        multiple: true,
        noClick: true,
        noKeyboard: true,
    });

    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                const videoTime = videoRef.current.currentTime;
                const currentClip = clips.find(c =>
                    c.sourceId === activeSourceId &&
                    videoTime >= c.sourceStart &&
                    videoTime < c.sourceEnd
                );

                if (!currentClip && clips.length > 0) {
                    const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                    const firstClip = sortedClips[0];

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
    }, [isPlaying, clips, activeSourceId, videoSources]);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            const videoTime = videoRef.current.currentTime;

            if (!isPlaying) return;

            const currentClip = clips.find(c =>
                c.sourceId === activeSourceId &&
                videoTime >= c.sourceStart &&
                videoTime < c.sourceEnd
            );

            if (currentClip) {
                const offsetInClip = videoTime - currentClip.sourceStart;
                const timelineTime = currentClip.timelineStart + offsetInClip;
                setCurrentTime(timelineTime);

                if (videoTime >= currentClip.sourceEnd - 0.05) {
                    const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                    const currentIndex = sortedClips.findIndex(c => c.id === currentClip.id);
                    const nextClip = sortedClips[currentIndex + 1];

                    if (nextClip) {
                        const nextSource = videoSources.find(s => s.id === nextClip.sourceId);

                        if (nextSource && nextSource.id !== activeSourceId) {
                            setShouldAutoPlay(true);
                            setPendingClipId(nextClip.id);
                            setVideoUrl(nextSource.url);
                            setVideoFile(nextSource.file);
                            setActiveSourceId(nextSource.id);
                            setDuration(nextSource.duration);
                        } else {
                            videoRef.current.currentTime = nextClip.sourceStart;
                        }
                        setSelectedClipId(nextClip.id);
                    } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
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
                const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                const nextClip = sortedClips.find(c => c.sourceId === activeSourceId && c.sourceStart > videoTime);

                if (nextClip) {
                    videoRef.current.currentTime = nextClip.sourceStart;
                    setSelectedClipId(nextClip.id);
                } else {
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
    }, [isPlaying, clips, activeSourceId, videoSources]);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current && activeSourceId) {
            const dur = videoRef.current.duration;
            setDuration(dur);

            if (clips.length === 0) {
                const initialClip: VideoClip = {
                    id: Date.now().toString(),
                    sourceId: activeSourceId,
                    sourceStart: 0,
                    sourceEnd: dur,
                    timelineStart: 0,
                    timelineEnd: dur,
                    duration: dur,
                    transition: 'none',
                };
                saveToHistory([initialClip]);
                setSelectedClipId(initialClip.id);
            }

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
    }, [activeSourceId, clips, pendingClipId, shouldAutoPlay, saveToHistory]);

    const handleSeek = useCallback((value: number[]) => {
        if (videoRef.current) {
            const targetTimelineTime = value[0];
            const targetClip = clips.find(c =>
                targetTimelineTime >= c.timelineStart && targetTimelineTime < c.timelineEnd
            );

            if (targetClip) {
                const offsetInClip = targetTimelineTime - targetClip.timelineStart;
                const sourceTime = targetClip.sourceStart + offsetInClip;

                const targetSource = videoSources.find(s => s.id === targetClip.sourceId);
                if (targetSource && targetSource.id !== activeSourceId) {
                    setVideoUrl(targetSource.url);
                    setVideoFile(targetSource.file);
                    setActiveSourceId(targetSource.id);
                    setDuration(targetSource.duration);
                    setPendingClipId(targetClip.id);
                    setShouldAutoPlay(false);
                } else {
                    videoRef.current.currentTime = sourceTime;
                }

                setCurrentTime(targetTimelineTime);
                setSelectedClipId(targetClip.id);
            } else {
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
    }, [clips, videoSources, activeSourceId]);

    const handleVolumeChange = useCallback((value: number[]) => {
        if (videoRef.current) {
            videoRef.current.volume = value[0];
            setVolume(value[0]);
        }
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const splitClip = useCallback(() => {
        if (!selectedClipId || !videoRef.current) return;

        const clip = clips.find(c => c.id === selectedClipId);
        if (!clip) return;

        const videoTime = videoRef.current.currentTime;

        if (videoTime <= clip.sourceStart || videoTime >= clip.sourceEnd) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }

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
            transition: 'none',
        };

        const clipIndex = clips.findIndex(c => c.id === selectedClipId);
        const newClips = [...clips];
        newClips[clipIndex] = newClip1;
        newClips.splice(clipIndex + 1, 0, newClip2);

        saveToHistory(newClips);
        setSelectedClipId(newClip2.id);
    }, [selectedClipId, clips, isPlaying, saveToHistory]);

    const deleteClip = useCallback((clipId: string) => {
        const newClips = clips.filter(c => c.id !== clipId);
        saveToHistory(newClips);
        if (selectedClipId === clipId) {
            setSelectedClipId(null);
        }
    }, [clips, selectedClipId, saveToHistory]);

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

    const addTextOverlay = useCallback(() => {
        const newOverlay: TextOverlay = {
            id: Date.now().toString(),
            text: "Nový text",
            x: 50,
            y: 50,
            fontSize: 32,
            color: "#ffffff",
        };
        setTextOverlays(prev => [...prev, newOverlay]);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    useEffect(() => {
        if (selectedClipId && videoRef.current) {
            const selectedClip = clips.find(c => c.id === selectedClipId);
            if (selectedClip) {
                const source = videoSources.find(s => s.id === selectedClip.sourceId);
                if (source && source.url !== videoUrl) {
                    const wasPlaying = isPlaying;

                    setVideoUrl(source.url);
                    setVideoFile(source.file);
                    setActiveSourceId(source.id);
                    setDuration(source.duration);

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
    }, [selectedClipId, clips, videoSources, videoUrl, isPlaying]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }
            if (((e.ctrlKey || e.metaKey) && e.code === 'KeyY') ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyZ')) {
                e.preventDefault();
                redo();
                return;
            }
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                togglePlayPause();
            }
            if ((e.code === 'Delete' || e.code === 'Backspace') && selectedClipId && clips.length > 1) {
                e.preventDefault();
                deleteClip(selectedClipId);
            }
            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                const currentClip = clips.find(c => currentTime >= c.timelineStart && currentTime < c.timelineEnd);
                if (currentClip) {
                    const newTime = Math.max(currentClip.timelineStart, currentTime - 0.5);
                    if (newTime > currentClip.timelineStart) {
                        handleSeek([newTime]);
                    } else {
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
                        const sortedClips = [...clips].sort((a, b) => a.timelineStart - b.timelineStart);
                        const currentIndex = sortedClips.findIndex(c => c.id === currentClip.id);
                        if (currentIndex < clips.length - 1) {
                            const nextClip = sortedClips[currentIndex + 1];
                            handleSeek([nextClip.timelineStart]);
                        }
                    }
                }
            }
            if (e.code === 'KeyS' && selectedClipId) {
                e.preventDefault();
                splitClip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTime, duration, selectedClipId, clips, undo, redo, togglePlayPause, deleteClip, handleSeek, splitClip]);

    const getTimelineWidth = useCallback(() => {
        if (clips.length === 0) return 2000;
        const totalDuration = clips.reduce((max, clip) => Math.max(max, clip.timelineEnd), 0);
        return Math.max(totalDuration * zoom * 100, 2000);
    }, [clips, zoom]);

    const getClipPosition = useCallback((clip: VideoClip) => {
        const pixelsPerSecond = 100 * zoom;
        return {
            left: clip.timelineStart * pixelsPerSecond,
            width: Math.max((clip.timelineEnd - clip.timelineStart) * pixelsPerSecond, 50),
        };
    }, [zoom]);

    const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current || selectedTool !== "split" || dragMode) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;

        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            const pos = getClipPosition(clip);

            if (clickX >= pos.left && clickX <= pos.left + pos.width) {
                const relativeX = clickX - pos.left;
                const pixelsPerSecond = 100 * zoom;
                const relativeTime = relativeX / pixelsPerSecond;
                const timelineTime = clip.timelineStart + relativeTime;
                const sourceTime = clip.sourceStart + relativeTime;

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
    }, [selectedTool, dragMode, clips, getClipPosition, zoom, activeSourceId, videoSources]);

    const handleTrimStart = useCallback((clipId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragMode('trim-start');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    }, []);

    const handleTrimEnd = useCallback((clipId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragMode('trim-end');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    }, []);

    const handleClipDragStart = useCallback((clipId: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('trim-handle')) return;
        e.stopPropagation();
        setDragMode('move');
        setDragClipId(clipId);
        setDragStartX(e.clientX);
        setSelectedClipId(clipId);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
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
            const rect = timelineRef.current?.getBoundingClientRect();
            if (!rect) return;

            const clickX = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
            const hoveredClipIndex = clips.findIndex((c) => {
                const pos = getClipPosition(c);
                return clickX >= pos.left && clickX <= pos.left + pos.width;
            });

            if (hoveredClipIndex !== -1) {
                const draggedIndex = clips.findIndex(c => c.id === dragClipId);
                if (draggedIndex !== hoveredClipIndex && draggedIndex !== -1) {
                    const newClips = [...clips];
                    const [draggedClip] = newClips.splice(draggedIndex, 1);
                    newClips.splice(hoveredClipIndex, 0, draggedClip);
                    setClips(newClips);
                }
            }
        }
    }, [dragMode, dragClipId, dragStartX, zoom, clips, videoSources, duration, getClipPosition]);

    const handleMouseUp = useCallback(() => {
        if (dragMode && dragClipId) {
            saveToHistory(clips);
        }
        setDragMode(null);
        setDragClipId(null);
    }, [dragMode, dragClipId, clips, saveToHistory]);

    // Export functionality
    const handleExport = useCallback(async () => {
        setIsExporting(true);
        setExportProgress(0);

        // Simulate export progress
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 500);

        // Simulated export - in production would use FFmpeg.wasm or server-side processing
        setTimeout(() => {
            clearInterval(interval);
            setExportProgress(100);

            setTimeout(() => {
                setIsExporting(false);
                setShowExportModal(false);
                setExportProgress(0);

                // Create a download link for the original video as placeholder
                if (videoUrl) {
                    const link = document.createElement('a');
                    link.href = videoUrl;
                    link.download = `export.${exportSettings.format}`;
                    link.click();
                }
            }, 500);
        }, 3000);
    }, [videoUrl, exportSettings.format]);

    // AI feature handler
    const handleAIFeature = useCallback(async (featureId: string) => {
        setProcessingAI(featureId);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setProcessingAI(null);

        // Show success feedback
        const feature = AI_FEATURES.find(f => f.id === featureId);
        if (feature) {
            alert(`${feature.name} bylo úspěšně aplikováno!`);
        }
    }, []);

    // Set transition for selected clip
    const setClipTransition = useCallback((transition: TransitionType) => {
        if (!selectedClipId) return;

        const newClips = clips.map(c =>
            c.id === selectedClipId ? { ...c, transition } : c
        );
        saveToHistory(newClips);
    }, [selectedClipId, clips, saveToHistory]);

    // Update audio track volume
    const updateAudioVolume = useCallback((trackId: string, newVolume: number) => {
        setAudioTracks(prev => prev.map(track =>
            track.id === trackId ? { ...track, volume: newVolume } : track
        ));
    }, []);

    // Remove audio track
    const removeAudioTrack = useCallback((trackId: string) => {
        setAudioTracks(prev => prev.filter(track => track.id !== trackId));
    }, []);

    return (
        <div className={`min-h-screen ${palette.page}`}>
            {/* Export Modal */}
            <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
                <DialogContent className={`${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'} max-w-lg`}>
                    <DialogHeader>
                        <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                            Export videa
                        </DialogTitle>
                        <DialogDescription className={isDark ? 'text-white/60' : 'text-slate-600'}>
                            Nastavte parametry exportu a stáhněte hotové video.
                        </DialogDescription>
                    </DialogHeader>

                    {isExporting ? (
                        <div className="py-8">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                <div className="text-center">
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Exportuji video...
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                                        {Math.round(exportProgress)}% dokončeno
                                    </p>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${exportProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            {/* Format */}
                            <div>
                                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Formát
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['mp4', 'webm', 'mov'] as const).map(format => (
                                        <Button
                                            key={format}
                                            variant={exportSettings.format === format ? 'default' : 'outline'}
                                            className={exportSettings.format !== format ? (isDark ? 'border-white/20 text-white' : '') : ''}
                                            onClick={() => setExportSettings(prev => ({ ...prev, format }))}
                                        >
                                            {format.toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Kvalita
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(Object.keys(QUALITY_PRESETS) as Array<keyof typeof QUALITY_PRESETS>).map(quality => (
                                        <Button
                                            key={quality}
                                            variant={exportSettings.quality === quality ? 'default' : 'outline'}
                                            size="sm"
                                            className={exportSettings.quality !== quality ? (isDark ? 'border-white/20 text-white' : '') : ''}
                                            onClick={() => setExportSettings(prev => ({ ...prev, quality }))}
                                        >
                                            {quality}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div>
                                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Poměr stran
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.entries(ASPECT_RATIOS) as [keyof typeof ASPECT_RATIOS, typeof ASPECT_RATIOS[keyof typeof ASPECT_RATIOS]][]).map(([key, value]) => (
                                        <Button
                                            key={key}
                                            variant={exportSettings.aspectRatio === key ? 'default' : 'outline'}
                                            size="sm"
                                            className={`justify-start ${exportSettings.aspectRatio !== key ? (isDark ? 'border-white/20 text-white' : '') : ''}`}
                                            onClick={() => setExportSettings(prev => ({ ...prev, aspectRatio: key }))}
                                        >
                                            <span className="font-mono mr-2">{key}</span>
                                            <span className={`text-xs ${exportSettings.aspectRatio === key ? 'opacity-80' : 'opacity-60'}`}>
                                                {value.label}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* FPS */}
                            <div>
                                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Snímková frekvence
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {([24, 30, 60] as const).map(fps => (
                                        <Button
                                            key={fps}
                                            variant={exportSettings.fps === fps ? 'default' : 'outline'}
                                            className={exportSettings.fps !== fps ? (isDark ? 'border-white/20 text-white' : '') : ''}
                                            onClick={() => setExportSettings(prev => ({ ...prev, fps }))}
                                        >
                                            {fps} FPS
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowExportModal(false)}
                            disabled={isExporting}
                            className={isDark ? 'border-white/20 text-white' : ''}
                        >
                            Zrušit
                        </Button>
                        <Button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Exportuji...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportovat
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Top Toolbar */}
            <div className={`sticky top-0 z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${palette.border}`}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">Video Editor</h1>
                        <div className={`h-6 w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}
                        >
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAIPanel(!showAIPanel)}
                            className={`${showAIPanel ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : (isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100')}`}
                        >
                            <Wand2 className="h-4 w-4 mr-2" />
                            AI Úpravy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Nastavení
                        </Button>
                        <Button
                            className={`${palette.accentButton} ${palette.accentButtonHover}`}
                            onClick={() => setShowExportModal(true)}
                            disabled={clips.length === 0}
                        >
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

                        {/* Transitions */}
                        {selectedClipId && (
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>Přechod</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {TRANSITIONS.map((t) => {
                                        const selectedClip = clips.find(c => c.id === selectedClipId);
                                        const isActive = selectedClip?.transition === t.id;
                                        return (
                                            <Button
                                                key={t.id}
                                                variant={isActive ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setClipTransition(t.id)}
                                                className={`text-xs h-8 font-medium ${isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 bg-white hover:bg-slate-100'}`}
                                            >
                                                {t.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                    {/* AI Panel */}
                    {showAIPanel && (
                        <div className={`border-b ${palette.border} p-4 ${isDark ? 'bg-purple-500/5' : 'bg-purple-50'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        AI Automatické úpravy
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowAIPanel(false)}
                                    className={isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : ''}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {AI_FEATURES.map((feature) => (
                                    <button
                                        key={feature.id}
                                        onClick={() => handleAIFeature(feature.id)}
                                        disabled={processingAI !== null}
                                        className={`p-4 rounded-xl border transition-all text-left ${
                                            isDark
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50'
                                                : 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
                                        } ${processingAI === feature.id ? 'ring-2 ring-purple-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            {processingAI === feature.id ? (
                                                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                            ) : (
                                                <feature.icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                                            )}
                                            <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {feature.name}
                                            </span>
                                        </div>
                                        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                                            {feature.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

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

                                <canvas ref={canvasRef} className="hidden" />

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

                {/* Right Sidebar - Sources & Audio */}
                {videoUrl && (
                    <div className={`w-64 border-l ${palette.border} p-4 overflow-y-auto`}>
                        <div className="space-y-6">
                            {/* Video Sources */}
                            <div>
                                <h3 className={`text-sm font-semibold mb-3 uppercase ${palette.muted}`}>
                                    Video soubory ({videoSources.length})
                                </h3>
                                <div className="space-y-2">
                                    {videoSources.map((source) => (
                                        <div
                                            key={source.id}
                                            className={`p-2 rounded-lg border cursor-pointer transition-all ${
                                                activeSourceId === source.id
                                                    ? 'border-indigo-500 bg-indigo-500/10'
                                                    : `${isDark ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300'}`
                                            }`}
                                            onClick={() => {
                                                setVideoUrl(source.url);
                                                setVideoFile(source.file);
                                                setActiveSourceId(source.id);
                                                setDuration(source.duration);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Film className={`w-4 h-4 ${activeSourceId === source.id ? 'text-indigo-400' : palette.muted}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {source.name}
                                                    </p>
                                                    <p className={`text-xs ${palette.subtle}`}>
                                                        {formatTime(source.duration)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Audio Tracks */}
                            <div {...getAudioRootProps()}>
                                <input {...getAudioInputProps()} ref={audioInputRef} />
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`text-sm font-semibold uppercase ${palette.muted}`}>
                                        Audio ({audioTracks.length})
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => audioInputRef.current?.click()}
                                        className={`h-7 ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : ''}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                {audioTracks.length === 0 ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                                            isDark ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                        onClick={() => audioInputRef.current?.click()}
                                    >
                                        <Music className={`w-8 h-8 mx-auto mb-2 ${palette.muted}`} />
                                        <p className={`text-xs ${palette.muted}`}>
                                            Přidat hudbu
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {audioTracks.map((track) => (
                                            <div
                                                key={track.id}
                                                className={`p-3 rounded-lg border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <Music className={`w-4 h-4 flex-shrink-0 ${palette.muted}`} />
                                                        <span className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {track.name}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-6 w-6 flex-shrink-0 ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : ''}`}
                                                        onClick={() => removeAudioTrack(track.id)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {track.volume === 0 ? (
                                                        <VolumeX className={`w-3 h-3 ${palette.muted}`} />
                                                    ) : track.volume < 0.5 ? (
                                                        <Volume1 className={`w-3 h-3 ${palette.muted}`} />
                                                    ) : (
                                                        <Volume2 className={`w-3 h-3 ${palette.muted}`} />
                                                    )}
                                                    <Slider
                                                        value={[track.volume]}
                                                        max={1}
                                                        step={0.01}
                                                        onValueChange={(value) => updateAudioVolume(track.id, value[0])}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                                        Klikni na clip a stiskni S pro rozdělení
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
                                            const pos = getClipPosition(clip);
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
                                                            {clip.transition && clip.transition !== 'none' && (
                                                                <span className="text-[10px] opacity-70">
                                                                    {TRANSITIONS.find(t => t.id === clip.transition)?.name}
                                                                </span>
                                                            )}
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

                                {/* Audio track visualization */}
                                {audioTracks.length > 0 && (
                                    <div className="absolute top-32 left-0 right-0 h-8 px-2">
                                        <div className={`text-xs font-medium mb-1 ${palette.muted}`}>Audio Track</div>
                                        <div className="relative h-6">
                                            {audioTracks.map((track) => (
                                                <div
                                                    key={track.id}
                                                    className="absolute h-full rounded bg-gradient-to-r from-green-500/60 to-emerald-500/60"
                                                    style={{
                                                        left: `${track.startTime * 100 * zoom}px`,
                                                        width: `${track.duration * 100 * zoom}px`,
                                                    }}
                                                >
                                                    <div className="px-2 h-full flex items-center">
                                                        <Music className="w-3 h-3 text-white mr-1" />
                                                        <span className="text-white text-xs truncate">{track.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Playhead */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-50"
                                    style={{
                                        left: `${currentTime * 100 * zoom}px`
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
