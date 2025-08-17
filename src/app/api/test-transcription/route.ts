import { NextRequest, NextResponse } from "next/server";
import { SpeechToTextService } from "@/lib/speechToText";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    console.log("Testing OpenAI transcription for:", file.name);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize speech service
    const speechService = new SpeechToTextService();

    // Set up FFmpeg
    if (!ffmpegStatic) {
      throw new Error('FFmpeg static binary not found');
    }
    
    console.log('FFmpeg path:', ffmpegStatic);
    ffmpeg.setFfmpegPath(ffmpegStatic);

    // Save input file temporarily
    const tempDir = path.join(process.cwd(), 'temp', 'transcription-test');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const inputPath = path.join(tempDir, `test_${Date.now()}_${file.name}`);
    fs.writeFileSync(inputPath, buffer);

    console.log("📁 Input file saved to:", inputPath);

    // Extract audio for transcription
    console.log("🎵 Extracting audio...");
    const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .output(audioPath)
        .audioCodec('mp3')
        .on('end', () => {
          console.log('Audio extraction completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('Audio extraction failed:', err);
          reject(err);
        })
        .run();
    });

    const audioBuffer = fs.readFileSync(audioPath);

    console.log("📝 Starting transcription with OpenAI...");
    
    // Test transcription
    const subtitleSegments = await speechService.transcribeAudio(
      audioBuffer,
      `audio_${Date.now()}.mp3`
    );

    console.log("✅ Transcription complete! Segments:", subtitleSegments.length);

    // Save as simple text file for easy viewing
    const textOutput = subtitleSegments
      .map((segment, index) => 
        `[${index + 1}] ${segment.start.toFixed(2)}s - ${segment.end.toFixed(2)}s\n${segment.text}\n`
      )
      .join('\n');

    const textFilePath = path.join(tempDir, `transcription_${Date.now()}.txt`);
    fs.writeFileSync(textFilePath, textOutput, 'utf8');

    // Also save as SRT for comparison
    const srtContent = await speechService.generateSubtitleFile(subtitleSegments, "srt");
    const srtFilePath = path.join(tempDir, `subtitles_${Date.now()}.srt`);
    fs.writeFileSync(srtFilePath, srtContent, 'utf8');

    // Cleanup temporary files
    try {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(audioPath);
    } catch (cleanupError) {
      console.log('Cleanup warning:', cleanupError);
    }

    console.log("💾 Files saved:");
    console.log("📄 Text file:", textFilePath);
    console.log("📄 SRT file:", srtFilePath);

    return NextResponse.json({
      success: true,
      message: "Transcription completed successfully!",
      results: {
        segmentCount: subtitleSegments.length,
        textFile: textFilePath,
        srtFile: srtFilePath,
        totalDuration: subtitleSegments[subtitleSegments.length - 1]?.end || 0,
        segments: subtitleSegments // Include actual transcription for preview
      }
    });

  } catch (error) {
    console.error("Transcription test failed:", error);
    return NextResponse.json({
      success: false,
      error: "Transcription failed: " + (error as Error).message
    }, { status: 500 });
  }
}
