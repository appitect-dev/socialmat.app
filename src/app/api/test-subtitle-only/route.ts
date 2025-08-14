import { NextResponse } from 'next/server';
import { VideoSubtitleProcessor } from '@/lib/videoSubtitleProcessor';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { testVideo } = await request.json();
    
    console.log('=== Testing Subtitle Addition Only ===');
    
    // Create paths
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    const outputDir = path.join(publicDir, 'processed');
    
    // Ensure directories exist
    await Promise.all([
      import('fs/promises').then(fs => fs.mkdir(tempDir, { recursive: true })),
      import('fs/promises').then(fs => fs.mkdir(outputDir, { recursive: true }))
    ]);

    const timestamp = Date.now();
    
    // Create a test video file (we'll use a sample if none provided)
    const inputVideoPath = testVideo || path.join(tempDir, 'sample.mp4');
    
    // Create test subtitle content
    const testSubtitleText = `Hello, this is a test subtitle.
This is the second line.
And this is the third line for testing.
Testing multiple subtitle lines.
Final test line.`;
    
    const srtPath = path.join(tempDir, `test_subtitles_${timestamp}.srt`);
    const outputPath = path.join(outputDir, `test_video_with_subtitles_${timestamp}.mp4`);
    
    console.log('Input video path:', inputVideoPath);
    console.log('SRT path:', srtPath);
    console.log('Output path:', outputPath);

    // Convert text to SRT format
    await VideoSubtitleProcessor.convertTextToSRT(testSubtitleText, srtPath, 2);
    console.log('✅ SRT file created');

    // Read the created SRT file to verify
    const srtContent = await import('fs/promises').then(fs => fs.readFile(srtPath, 'utf-8'));
    console.log('📄 SRT content preview:');
    console.log(srtContent.substring(0, 200) + '...');

    // If no test video provided, we can't process - return the SRT for now
    if (!testVideo) {
      return NextResponse.json({
        success: true,
        message: 'SRT file created successfully (no video to process)',
        srtPath: `/temp/test_subtitles_${timestamp}.srt`,
        srtContent: srtContent
      });
    }

    // Validate input file exists
    try {
      await VideoSubtitleProcessor.validateInputFiles(inputVideoPath, srtPath);
      console.log('✅ Input files validated');
    } catch (error) {
      console.error('❌ Input file validation failed:', error);
      return NextResponse.json({
        error: 'Input file validation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        inputVideoPath,
        srtPath
      }, { status: 400 });
    }

    // Process video with subtitles
    console.log('🎬 Starting video processing...');
    let lastProgress = 0;
    const finalOutputPath = await VideoSubtitleProcessor.addSubtitlesToVideo({
      inputVideoPath,
      outputVideoPath: outputPath,
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

    console.log('✅ Video processing completed successfully!');
    console.log('📁 Final output:', finalOutputPath);

    // Check output file size
    const stats = await import('fs/promises').then(fs => fs.stat(finalOutputPath));
    console.log('📊 Output file size:', stats.size, 'bytes');

    if (stats.size < 1000) {
      console.warn('⚠️  Output file is very small, might be corrupted');
    }

    // Clean up temporary SRT file
    try {
      await import('fs/promises').then(fs => fs.unlink(srtPath));
      console.log('🧹 Temporary SRT file cleaned up');
    } catch (error) {
      console.warn('Could not clean up temp file:', error);
    }

    // Return relative path for frontend
    const relativePath = path.relative(publicDir, finalOutputPath);

    return NextResponse.json({
      success: true,
      outputPath: `/${relativePath.replace(/\\/g, '/')}`,
      outputSize: stats.size,
      message: stats.size > 1000 
        ? 'Video with subtitles created successfully!' 
        : 'Video created but file size is suspiciously small - check the output'
    });

  } catch (error) {
    console.error('=== Subtitle Test Error ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      error: 'Failed to test subtitle addition',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
