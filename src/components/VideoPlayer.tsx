"use client";

import React, { useRef, useState, useEffect } from "react";

// Props pro VideoPlayer komponentu
interface VideoPlayerProps {
  src: string; // URL videa
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  // Reference na HTML5 video element
  const videoRef = useRef<HTMLVideoElement>(null);

  // State pro sledování stavu přehrávání
  const [isPlaying, setIsPlaying] = useState(false);
  // State pro hlasitost (0-1)
  const [volume, setVolume] = useState(1);
  // State pro aktuální čas videa
  const [currentTime, setCurrentTime] = useState(0);
  // State pro celkovou délku videa
  const [duration, setDuration] = useState(0);
  // State pro zobrazení/skrytí ovládacích prvků
  const [showControls, setShowControls] = useState(true);

  // Funkce pro play/pause
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

  // Funkce pro změnu hlasitosti
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Funkce pro změnu času videa (seekování)
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Funkce pro formátování času (sekundy -> mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Effect pro sledování času videa
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handler pro aktualizaci času
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    // Handler pro načtení metadat videa
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    // Handler pro konec videa
    const handleEnded = () => {
      setIsPlaying(false);
    };

    // Přidání event listenerů
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    // Cleanup - odstranění event listenerů
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Kontejner pro video a ovládací prvky */}
      <div
        className="relative bg-black rounded-lg overflow-hidden shadow-xl"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(true)} // Nechám vždy viditelné pro lepší UX
      >
        {/* HTML5 Video element */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto"
          onClick={togglePlay}
        >
          Váš prohlížeč nepodporuje HTML5 video.
        </video>

        {/* Ovládací prvky */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress bar - časová osa */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimeChange}
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FAE12A 0%, #FAE12A ${
                  (currentTime / duration) * 100
                }%, #3f3f46 ${(currentTime / duration) * 100}%, #3f3f46 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Tlačítka a ovládání */}
          <div className="flex items-center gap-4">
            {/* Play/Pause tlačítko */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-[#FAE12A] transition-colors p-2"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                // Pause icon
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              ) : (
                // Play icon
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>

            {/* Ovládání hlasitosti */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              {/* Volume icon */}
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
              </svg>
              {/* Volume slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FAE12A 0%, #FAE12A ${volume * 100}%, #3f3f46 ${volume * 100}%, #3f3f46 100%)`,
                }}
              />
              <span className="text-white text-sm min-w-[3ch]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
