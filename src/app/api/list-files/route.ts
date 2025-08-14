import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    const videosDir = path.join(tempDir, 'videos');
    const transcriptionDir = path.join(tempDir, 'transcription-test');
    
    const results = {
      videoFiles: [] as Array<{name: string; path: string; size: number; modified: Date}>,
      subtitleFiles: [] as Array<{name: string; path: string; size: number; modified: Date}>,
      transcriptionFiles: [] as Array<{name: string; path: string; size: number; modified: Date}>
    };

    // Check videos directory
    if (fs.existsSync(videosDir)) {
      const videoFiles = fs.readdirSync(videosDir);
      for (const file of videoFiles) {
        const filePath = path.join(videosDir, file);
        const stats = fs.statSync(filePath);
        if (file.endsWith('.srt') || file.endsWith('.vtt')) {
          results.subtitleFiles.push({
            name: file,
            path: filePath,
            size: stats.size,
            modified: stats.mtime
          });
        } else if (file.endsWith('.mp4') || file.endsWith('.MOV') || file.endsWith('.avi')) {
          results.videoFiles.push({
            name: file,
            path: filePath,
            size: stats.size,
            modified: stats.mtime
          });
        }
      }
    }

    // Check transcription test directory
    if (fs.existsSync(transcriptionDir)) {
      const transcriptionFiles = fs.readdirSync(transcriptionDir);
      for (const file of transcriptionFiles) {
        const filePath = path.join(transcriptionDir, file);
        const stats = fs.statSync(filePath);
        results.transcriptionFiles.push({
          name: file,
          path: filePath,
          size: stats.size,
          modified: stats.mtime
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "File listing completed",
      results,
      directories: {
        temp: tempDir,
        videos: videosDir,
        transcription: transcriptionDir
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to list files: " + (error as Error).message
    }, { status: 500 });
  }
}
