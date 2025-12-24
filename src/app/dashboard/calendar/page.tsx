"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardTheme } from "@/components/dashboard-theme";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Instagram,
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    Clock,
    MoreHorizontal,
    Image as ImageIcon,
    Video,
    FileText,
} from "lucide-react";

interface Post {
    id: string;
    date: Date;
    time: string;
    platform: "instagram" | "facebook" | "twitter" | "linkedin" | "youtube";
    content: string;
    mediaType: "image" | "video" | "text";
    status: "scheduled" | "published" | "draft";
}

const platformIcons = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
};

const platformColors = {
    instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
    facebook: "bg-blue-600",
    twitter: "bg-sky-500",
    linkedin: "bg-blue-700",
    youtube: "bg-red-600",
};

const mediaTypeIcons = {
    image: ImageIcon,
    video: Video,
    text: FileText,
};

export default function CalendarPage() {
    const { isDark, palette } = useDashboardTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<"month" | "week">("month");
    
    // Mock data
    const [posts] = useState<Post[]>([
        {
            id: "1",
            date: new Date(2025, 11, 25),
            time: "10:00",
            platform: "instagram",
            content: "Check out our latest product! 🚀",
            mediaType: "image",
            status: "scheduled",
        },
        {
            id: "2",
            date: new Date(2025, 11, 25),
            time: "14:30",
            platform: "facebook",
            content: "New blog post is live!",
            mediaType: "text",
            status: "scheduled",
        },
        {
            id: "3",
            date: new Date(2025, 11, 26),
            time: "09:00",
            platform: "twitter",
            content: "Morning motivation 💪",
            mediaType: "image",
            status: "scheduled",
        },
        {
            id: "4",
            date: new Date(2025, 11, 27),
            time: "16:00",
            platform: "youtube",
            content: "Tutorial: Getting Started",
            mediaType: "video",
            status: "scheduled",
        },
    ]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Previous month's days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
            });
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }

        // Next month's days
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const getPostsForDate = (date: Date) => {
        return posts.filter(post => {
            return post.date.toDateString() === date.toDateString();
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = [
        "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
        "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
    ];

    const dayNames = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

    const days = getDaysInMonth(currentDate);
    const today = new Date();

    return (
        <div className={`min-h-screen ${palette.page}`}>
            {/* Header */}
            <div className="p-8 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Kalendář obsahu</h1>
                        <p className={palette.muted}>
                            Naplánujte a spravujte váš content na všech platformách
                        </p>
                    </div>
                    <Button className={`${palette.accentButton} ${palette.accentButtonHover}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nový příspěvek
                    </Button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <Card className={`${palette.card} p-6 mb-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={previousMonth}
                                    className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <h2 className="text-2xl font-bold min-w-[200px] text-center">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextMonth}
                                    className={isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100'}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={view === "month" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setView("month")}
                                    className={view !== "month" ? (isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100') : ''}
                                >
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Měsíc
                                </Button>
                                <Button
                                    variant={view === "week" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setView("week")}
                                    className={view !== "week" ? (isDark ? 'text-white border-white/20 hover:bg-white/10' : 'text-slate-900 border-slate-300 hover:bg-slate-100') : ''}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Týden
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Calendar Grid */}
                    <Card className={`${palette.card} p-6`}>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {dayNames.map((day) => (
                                <div
                                    key={day}
                                    className={`text-center text-sm font-semibold py-2 ${palette.muted}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day, index) => {
                                const dayPosts = getPostsForDate(day.date);
                                const isToday = day.date.toDateString() === today.toDateString();

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[120px] p-2 rounded-lg border transition-all cursor-pointer ${
                                            day.isCurrentMonth
                                                ? isDark
                                                    ? 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                : isDark
                                                    ? 'border-white/5 bg-white/[0.02]'
                                                    : 'border-slate-100 bg-slate-50/50'
                                        } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`text-sm font-medium ${
                                                    day.isCurrentMonth
                                                        ? isToday
                                                            ? 'text-indigo-500 font-bold'
                                                            : ''
                                                        : palette.subtle
                                                }`}
                                            >
                                                {day.date.getDate()}
                                            </span>
                                            {dayPosts.length > 0 && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                    isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                    {dayPosts.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Posts for this day */}
                                        <div className="space-y-1">
                                            {dayPosts.slice(0, 3).map((post) => {
                                                const PlatformIcon = platformIcons[post.platform];
                                                const MediaIcon = mediaTypeIcons[post.mediaType];
                                                
                                                return (
                                                    <div
                                                        key={post.id}
                                                        className={`p-1.5 rounded text-xs ${platformColors[post.platform]} text-white flex items-center gap-1.5 shadow-sm hover:shadow-md transition-shadow`}
                                                    >
                                                        <PlatformIcon className="h-3 w-3 flex-shrink-0" />
                                                        <MediaIcon className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                        <span className="truncate flex-1 text-[10px] font-medium">
                                                            {post.time}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {dayPosts.length > 3 && (
                                                <div className={`text-[10px] ${palette.subtle} text-center py-0.5`}>
                                                    +{dayPosts.length - 3} další
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Upcoming Posts */}
                    <Card className={`${palette.card} p-6 mt-6`}>
                        <h3 className="text-lg font-semibold mb-4">Nadcházející příspěvky</h3>
                        <div className="space-y-3">
                            {posts.slice(0, 5).map((post) => {
                                const PlatformIcon = platformIcons[post.platform];
                                const MediaIcon = mediaTypeIcons[post.mediaType];
                                
                                return (
                                    <div
                                        key={post.id}
                                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                                            isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                                        } transition-colors`}
                                    >
                                        <div className={`w-12 h-12 rounded-lg ${platformColors[post.platform]} flex items-center justify-center`}>
                                            <PlatformIcon className="h-6 w-6 text-white" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MediaIcon className={`h-4 w-4 ${palette.muted}`} />
                                                <span className="font-medium truncate">{post.content}</span>
                                            </div>
                                            <div className={`text-sm ${palette.muted}`}>
                                                {post.date.toLocaleDateString('cs-CZ')} • {post.time}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                post.status === 'scheduled'
                                                    ? isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                                    : post.status === 'published'
                                                    ? isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                                                    : isDark ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {post.status === 'scheduled' ? 'Naplánováno' : post.status === 'published' ? 'Publikováno' : 'Koncept'}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
