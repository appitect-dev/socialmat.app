import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET() {
  try {
    console.log('=== Direct Subtitle Test ===');
    
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    
    // Paths for our test
    const inputVideo = path.join(tempDir, 'test_video.mp4');
    const srtFile = path.join(tempDir, 'simple_test.srt');
    const outputVideo = path.join(tempDir, 'direct_test_output.mp4');
    
    console.log('Input video:', inputVideo);
    console.log('SRT file:', srtFile);
    console.log('Output video:', outputVideo);
    
    // Check if input video exists
    try {
      const stats = await import('fs/promises').then(fs => fs.stat(inputVideo));
      console.log('✅ Input video exists:', stats.size, 'bytes');
    } catch (error) {
      return NextResponse.json({
        error: 'Input video not found. Run /api/test-ffmpeg first to create a test video.',
        inputPath: inputVideo
      }, { status: 400 });
    }
    
    // Create a simple SRT file
    const srtContent = `1
00:00:00,500 --> 00:00:02,500
Hello World Test

2
00:00:03,000 --> 00:00:05,000
This is working!
`;
    
    await import('fs/promises').then(fs => fs.writeFile(srtFile, srtContent));
    console.log('✅ SRT file created');
    
    // Test our exact FFmpeg command that's causing issues
    console.log('🎬 Testing subtitle addition...');
    
    const ffmpegArgs = [
      '-i', inputVideo,
      '-vf', `subtitles=${srtFile}:force_style='FontSize=24,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2'`,
      '-c:a', 'copy',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-avoid_negative_ts', 'make_zero',
      '-y',
      outputVideo
    ];
    
    console.log('FFmpeg command:', ffmpegArgs.join(' '));
    
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      let stderr = '';
      let stdout = '';
      
      ffmpeg.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.log('FFmpeg:', output.trim());
      });
      
      ffmpeg.on('close', (code) => {
        console.log(`FFmpeg exited with code: ${code}`);
        if (code === 0) {
          console.log('✅ Direct test completed successfully');
          resolve();
        } else {
          console.error('❌ Direct test failed');
          console.error('stderr:', stderr);
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        console.error('❌ FFmpeg process error:', error);
        reject(error);
      });
    });
    
    // Check output size
    const outputStats = await import('fs/promises').then(fs => fs.stat(outputVideo));
    console.log('📊 Output file size:', outputStats.size, 'bytes');
    
    return NextResponse.json({
      success: outputStats.size > 100,
      message: outputStats.size > 100 ? 'Direct subtitle test passed!' : 'Output file too small',
      outputSize: outputStats.size,
      outputPath: `/temp/direct_test_output.mp4`
    });
    
  } catch (error) {
    console.error('=== Direct Test Error ===');
    console.error(error);
    
    return NextResponse.json({
      success: false,
      error: 'Direct subtitle test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
