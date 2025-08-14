import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    console.log('=== Audio Test ===');
    
    // Check for test video
    const testVideoPath = path.join(process.cwd(), 'public', 'temp', 'test_video.mp4');
    
    if (!fs.existsSync(testVideoPath)) {
      return NextResponse.json({
        error: 'No test video found',
        searchPath: testVideoPath
      });
    }

    console.log('Testing video at:', testVideoPath);

    // Check original video audio info
    const audioInfo = await new Promise<string>((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-show_streams',
        '-select_streams', 'a:0',
        '-of', 'csv=p=0',
        testVideoPath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`ffprobe failed with code ${code}`));
        }
      });
    });

    // Test our FFmpeg command to ensure audio is preserved
    const outputPath = path.join(process.cwd(), 'public', 'temp', 'audio_test_output.mp4');
    const srtPath = path.join(process.cwd(), 'public', 'temp', 'test.srt');

    const testCommand = [
      '-i', testVideoPath,
      '-vf', `subtitles=${srtPath}:force_style='FontSize=24,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2'`,
      '-c:a', 'copy', // This should preserve audio
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-y',
      outputPath
    ];

    console.log('Running FFmpeg with command:', testCommand);

    const result = await new Promise<string>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', testCommand);
      
      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(stderr);
        } else {
          reject(new Error(`FFmpeg failed: ${stderr}`));
        }
      });
    });

    // Check if output file has audio
    let outputHasAudio = false;
    if (fs.existsSync(outputPath)) {
      try {
        const outputAudioInfo = await new Promise<string>((resolve, reject) => {
          const ffprobe = spawn('ffprobe', [
            '-v', 'quiet',
            '-show_streams',
            '-select_streams', 'a:0',
            '-of', 'csv=p=0',
            outputPath
          ]);

          let output = '';
          ffprobe.stdout.on('data', (data) => {
            output += data.toString();
          });

          ffprobe.on('close', (code) => {
            resolve(output);
          });
        });
        
        outputHasAudio = outputAudioInfo.trim().length > 0;
      } catch (error) {
        console.error('Could not check output audio:', error);
      }
    }

    return NextResponse.json({
      success: true,
      originalAudioInfo: audioInfo.trim(),
      originalHasAudio: audioInfo.trim().length > 0,
      outputExists: fs.existsSync(outputPath),
      outputHasAudio,
      command: testCommand,
      ffmpegOutput: result.substring(0, 500) + '...'
    });

  } catch (error) {
    console.error('Audio test error:', error);
    return NextResponse.json({
      error: 'Audio test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
