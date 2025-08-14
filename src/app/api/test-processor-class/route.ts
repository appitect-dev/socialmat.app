import { NextResponse } from 'next/server';
import { VideoSubtitleProcessor } from '@/lib/videoSubtitleProcessor';
import path from 'path';

export async function GET() {
  try {
    console.log('=== Testing VideoSubtitleProcessor Class ===');
    
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    
    // Use the same files that worked in our direct test
    const inputVideoPath = path.join(tempDir, 'test_video.mp4');
    const outputVideoPath = path.join(tempDir, 'processor_class_output.mp4');
    
    console.log('Input video:', inputVideoPath);
    console.log('Output video:', outputVideoPath);
    
    // Create test subtitle text
    const testSubtitleText = `Hello World Test
This is working!
Third line for testing
Fourth subtitle line
Final test line`;
    
    const timestamp = Date.now();
    const srtPath = path.join(tempDir, `class_test_${timestamp}.srt`);
    
    console.log('SRT path:', srtPath);
    
    // Step 1: Convert text to SRT
    console.log('📝 Converting text to SRT...');
    await VideoSubtitleProcessor.convertTextToSRT(testSubtitleText, srtPath, 2);
    console.log('✅ SRT conversion completed');
    
    // Check the SRT content
    const srtContent = await import('fs/promises').then(fs => fs.readFile(srtPath, 'utf-8'));
    console.log('📄 SRT content preview:', srtContent.substring(0, 200) + '...');
    
    // Step 2: Validate input files
    console.log('🔍 Validating input files...');
    await VideoSubtitleProcessor.validateInputFiles(inputVideoPath, srtPath);
    console.log('✅ Input files validated');
    
    // Step 3: Add subtitles to video using our class
    console.log('🎬 Adding subtitles with VideoSubtitleProcessor...');
    let lastProgress = 0;
    
    const finalOutputPath = await VideoSubtitleProcessor.addSubtitlesToVideo({
      inputVideoPath,
      outputVideoPath,
      subtitlePath: srtPath,
      style: {
        fontSize: 24,
        fontColor: 'white',
        backgroundColor: 'black@0.8',
        outlineColor: 'black',
        outlineWidth: 2,
        position: 'bottom',
        marginVertical: 50
      },
      onProgress: (progress) => {
        if (progress !== lastProgress) {
          console.log(`📈 Progress: ${progress}%`);
          lastProgress = progress;
        }
      }
    });
    
    console.log('✅ VideoSubtitleProcessor completed successfully!');
    console.log('📁 Final output:', finalOutputPath);
    
    // Check output file size
    const stats = await import('fs/promises').then(fs => fs.stat(finalOutputPath));
    console.log('📊 Output file size:', stats.size, 'bytes');
    
    const success = stats.size > 1000;
    
    // Clean up SRT file
    try {
      await import('fs/promises').then(fs => fs.unlink(srtPath));
      console.log('🧹 SRT file cleaned up');
    } catch (error) {
      console.warn('Could not clean up SRT file:', error);
    }
    
    return NextResponse.json({
      success,
      message: success ? 'VideoSubtitleProcessor class works perfectly!' : 'Output file too small',
      outputSize: stats.size,
      outputPath: `/temp/processor_class_output.mp4`,
      srtContent: srtContent.substring(0, 300)
    });
    
  } catch (error) {
    console.error('=== VideoSubtitleProcessor Test Error ===');
    console.error(error);
    
    return NextResponse.json({
      success: false,
      error: 'VideoSubtitleProcessor test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
