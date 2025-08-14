import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET() {
  try {
    console.log('=== Creating Highly Visible Subtitle Test ===');
    
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    
    // Ensure temp directory exists
    await import('fs/promises').then(fs => fs.mkdir(tempDir, { recursive: true }));
    
    // Use existing test video or create new one
    const inputVideo = path.join(tempDir, 'test_video.mp4');
    const outputVideo = path.join(tempDir, 'highly_visible_subtitles.mp4');
    
    // Check if input video exists, create if needed
    try {
      await import('fs/promises').then(fs => fs.stat(inputVideo));
      console.log('✅ Using existing test video');
    } catch {
      console.log('📹 Creating new test video...');
      await new Promise<void>((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
          '-f', 'lavfi',
          '-i', 'testsrc=duration=8:size=720x480:rate=30',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-y',
          inputVideo
        ]);
        
        ffmpeg.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Failed to create test video: ${code}`));
        });
        
        ffmpeg.on('error', reject);
      });
      console.log('✅ New test video created');
    }
    
    // Create highly visible SRT file
    const srtFile = path.join(tempDir, 'highly_visible.srt');
    const srtContent = `1
00:00:00,500 --> 00:00:02,500
🎬 SUBTITLE TEST - WHITE TEXT

2
00:00:03,000 --> 00:00:05,000
📺 THIS SHOULD BE VISIBLE

3
00:00:05,500 --> 00:00:07,500
✅ TESTING SUBTITLES WORK!
`;
    
    await import('fs/promises').then(fs => fs.writeFile(srtFile, srtContent));
    console.log('✅ Highly visible SRT file created');
    console.log('SRT content:', srtContent);
    
    // Use advanced FFmpeg subtitle filter with maximum visibility
    console.log('🎨 Adding highly visible subtitles...');
    
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputVideo,
        '-vf', [
          'subtitles=' + srtFile + ':force_style=\'',
          'FontName=Arial Bold,',
          'FontSize=36,',
          'PrimaryColour=&Hffffff,',      // White text
          'SecondaryColour=&Hffffff,',    // White secondary
          'OutlineColour=&H000000,',      // Black outline
          'BackColour=&H80000000,',       // Semi-transparent black background
          'Bold=1,',
          'Outline=3,',                   // Thick outline
          'Shadow=2,',                    // Drop shadow
          'Alignment=2,',                 // Bottom center
          'MarginV=40',                   // Bottom margin
          '\''
        ].join(''),
        '-c:a', 'copy',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-y',
        outputVideo
      ]);
      
      let stderr = '';
      
      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        if (output.includes('frame=')) {
          process.stdout.write('.');
        }
      });
      
      ffmpeg.on('close', (code) => {
        console.log(''); // New line after dots
        if (code === 0) {
          console.log('✅ Highly visible subtitles completed');
          resolve();
        } else {
          console.error('❌ Failed to add subtitles:', stderr);
          reject(new Error(`Subtitle processing failed: ${code}`));
        }
      });
      
      ffmpeg.on('error', (error) => {
        console.error('❌ FFmpeg error:', error);
        reject(error);
      });
    });
    
    // Check output file
    const stats = await import('fs/promises').then(fs => fs.stat(outputVideo));
    console.log('📊 Output file size:', stats.size, 'bytes');
    
    return NextResponse.json({
      success: stats.size > 1000,
      message: 'Highly visible subtitle test completed',
      outputPath: `/temp/highly_visible_subtitles.mp4`,
      outputSize: stats.size,
      srtContent: srtContent
    });
    
  } catch (error) {
    console.error('=== Visible Subtitle Test Error ===');
    console.error(error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create visible subtitle test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
