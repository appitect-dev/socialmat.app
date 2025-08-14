import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET() {
  try {
    console.log('=== Testing FFmpeg Installation ===');
    
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    
    // Ensure temp directory exists
    await import('fs/promises').then(fs => fs.mkdir(tempDir, { recursive: true }));
    
    // Test 1: Check FFmpeg version
    console.log('📋 Checking FFmpeg version...');
    const versionResult = await new Promise<string>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-version']);
      let output = '';
      
      ffmpeg.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`FFmpeg version check failed with code ${code}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
    
    console.log('✅ FFmpeg version info:', versionResult.split('\n')[0]);
    
    // Test 2: Create a simple test video
    console.log('🎬 Creating test video...');
    const testVideoPath = path.join(tempDir, 'test_video.mp4');
    
    await new Promise<void>((resolve, reject) => {
      // Create a 5-second test video with color bars
      const ffmpeg = spawn('ffmpeg', [
        '-f', 'lavfi',
        '-i', 'testsrc=duration=5:size=640x480:rate=30',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-y',
        testVideoPath
      ]);
      
      let stderr = '';
      
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Test video created successfully');
          resolve();
        } else {
          console.error('❌ Test video creation failed:', stderr);
          reject(new Error(`Test video creation failed with code ${code}: ${stderr}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
    
    // Check if test video was created and get its size
    const stats = await import('fs/promises').then(fs => fs.stat(testVideoPath));
    console.log('📊 Test video size:', stats.size, 'bytes');
    
    // Test 3: Create a simple SRT file
    const srtPath = path.join(tempDir, 'test.srt');
    const srtContent = `1
00:00:01,000 --> 00:00:03,000
Hello World!

2
00:00:03,500 --> 00:00:05,000
This is a test subtitle.
`;
    
    await import('fs/promises').then(fs => fs.writeFile(srtPath, srtContent));
    console.log('✅ Test SRT file created');
    
    // Test 4: Try adding subtitles to the test video
    console.log('🎨 Testing subtitle addition...');
    const outputPath = path.join(tempDir, 'test_video_with_subtitles.mp4');
    
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', testVideoPath,
        '-vf', `subtitles=${srtPath}`,
        '-c:a', 'copy',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-y',
        outputPath
      ]);
      
      let stderr = '';
      
      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        
        // Show progress
        if (output.includes('frame=')) {
          process.stdout.write('.');
        }
      });
      
      ffmpeg.on('close', (code) => {
        console.log(''); // New line after dots
        if (code === 0) {
          console.log('✅ Subtitle addition test completed');
          resolve();
        } else {
          console.error('❌ Subtitle addition failed:', stderr);
          reject(new Error(`Subtitle addition failed with code ${code}: ${stderr}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
    
    // Check output file size
    const outputStats = await import('fs/promises').then(fs => fs.stat(outputPath));
    console.log('📊 Output video with subtitles size:', outputStats.size, 'bytes');
    
    const success = outputStats.size > 1000; // Should be more than 1KB
    
    return NextResponse.json({
      success,
      message: success ? 'All FFmpeg tests passed!' : 'Tests completed but output seems small',
      results: {
        ffmpegVersion: versionResult.split('\n')[0],
        testVideoSize: stats.size,
        outputVideoSize: outputStats.size,
        testVideoPath: `/temp/test_video.mp4`,
        outputVideoPath: `/temp/test_video_with_subtitles.mp4`
      }
    });
    
  } catch (error) {
    console.error('=== FFmpeg Test Error ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'FFmpeg test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
