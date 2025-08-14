import { NextRequest, NextResponse } from "next/server";
import { VideoProcessor, VideoProcessingOptions } from "@/lib/videoProcessor";
import { SpeechToTextService } from "@/lib/speechToText";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;
    const settingsString = formData.get("settings") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    const settings = JSON.parse(settingsString || "{}");

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize processors
    const videoProcessor = new VideoProcessor();
    const speechService = new SpeechToTextService(
      process.env.OPENAI_API_KEY || ""
    );

    // Process video with real functionality
    const processingOptions: VideoProcessingOptions = {
      subtitles: settings.subtitles,
      animations: settings.animations,
      soundEffects: settings.soundEffects,
      filters: settings.filters,
    };

    console.log("Starting video processing...", { filename: file.name });

    const { outputPath, metadata } = await videoProcessor.processVideo(
      buffer,
      file.name,
      processingOptions
    );

    // Generate thumbnail
    let thumbnailPath: string | null = null;
    try {
      thumbnailPath = await videoProcessor.generateThumbnail(outputPath);
    } catch (thumbError) {
      console.warn("Thumbnail generation failed:", thumbError);
    }

    // If subtitles are enabled, generate them
    let subtitlePath: string | null = null;
    if (settings.subtitles?.enabled) {
      try {
        // Extract audio for speech-to-text
        const audioPath = await videoProcessor.extractAudio(outputPath);
        const audioBuffer = fs.readFileSync(audioPath);

        // Generate subtitles
        const subtitleSegments = await speechService.transcribeAudio(
          audioBuffer,
          `audio_${Date.now()}.mp3`
        );
        const subtitleContent = await speechService.generateSubtitleFile(
          subtitleSegments,
          "srt"
        );

        // Save subtitle file
        subtitlePath = outputPath.replace(".mp4", ".srt");
        fs.writeFileSync(subtitlePath, subtitleContent);

        // Clean up audio file
        videoProcessor.cleanup(audioPath);
      } catch (subtitleError) {
        console.warn("Subtitle generation failed:", subtitleError);
      }
    }

    // In a production app, you'd upload these files to cloud storage
    // For now, we'll return local paths
    const result = {
      videoUrl: `/api/videos/serve/${encodeURIComponent(
        outputPath.split("/").pop() || ""
      )}`,
      thumbnailUrl: thumbnailPath
        ? `/api/videos/serve/${encodeURIComponent(
            thumbnailPath.split("/").pop() || ""
          )}`
        : null,
      subtitleUrl: subtitlePath
        ? `/api/videos/serve/${encodeURIComponent(
            subtitlePath.split("/").pop() || ""
          )}`
        : null,
      metadata: {
        duration: metadata.duration,
        size: fs.statSync(outputPath).size,
        format: "mp4",
        width: metadata.width,
        height: metadata.height,
        fps: metadata.fps
      },
    };

    return NextResponse.json({
      success: true,
      message: "Video processed successfully",
      result,
    });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process video: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
