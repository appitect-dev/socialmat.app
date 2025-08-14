import { NextResponse } from 'next/server';
import { VideoSubtitleProcessor } from '@/lib/videoSubtitleProcessor';
import { SpeechToTextService } from '@/lib/speechToText';
import { VideoProcessor } from '@/lib/videoProcessor';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { videoPath, outputFilename, maxWordsPerChunk = 4 } = await request.json();
    
    if (!videoPath) {
      return NextResponse.json({ 
        error: 'videoPath is required' 
      }, { status: 400 });
    }

    console.log('=== Starting Subtitle Processing ===');
    console.log('Video path (relative):', videoPath);
    
    // Convert relative path to absolute path
    const fullVideoPath = videoPath.startsWith('/') 
      ? path.join(process.cwd(), 'public', videoPath.substring(1))
      : path.join(process.cwd(), 'public', videoPath);
    
    console.log('Video path (absolute):', fullVideoPath);
    
    // Verify the video file exists
    if (!fs.existsSync(fullVideoPath)) {
      return NextResponse.json({ 
        error: `Video file not found: ${fullVideoPath}` 
      }, { status: 404 });
    }
    
    console.log('🎵 Extracting audio for transcription...');
    
    // Initialize services
    const videoProcessor = new VideoProcessor();
    const speechService = new SpeechToTextService();
    
    // Extract audio from video for transcription
    const tempDir = path.join(process.cwd(), 'temp', 'transcription');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const audioPath = await videoProcessor.extractAudio(fullVideoPath);
    const audioBuffer = fs.readFileSync(audioPath);
    
    console.log('📝 Transcribing with OpenAI Whisper...');
    
    // Transcribe audio with OpenAI Whisper
    const subtitleSegments = await speechService.transcribeAudio(
      audioBuffer,
      `audio_${Date.now()}.mp3`
    );
    
    console.log(`✅ Transcription complete! Got ${subtitleSegments.length} segments`);
    
    // Convert segments to text format for preview
    const totalWords = subtitleSegments.reduce((count, seg) => count + seg.text.split(/\s+/).length, 0);
    console.log(`📊 Total words: ${totalWords}, Target chunks: ${Math.ceil(totalWords / maxWordsPerChunk)}`);

    // Create paths
    const publicDir = path.join(process.cwd(), 'public');
    const videoTempDir = path.join(publicDir, 'temp');
    const outputDir = path.join(publicDir, 'processed');
    
    // Ensure directories exist
    await Promise.all([
      import('fs/promises').then(fs => fs.mkdir(videoTempDir, { recursive: true })),
      import('fs/promises').then(fs => fs.mkdir(outputDir, { recursive: true }))
    ]);

    const timestamp = Date.now();
    const srtPath = path.join(videoTempDir, `subtitles_${timestamp}.srt`);
    const outputPath = path.join(outputDir, outputFilename || `video_with_subtitles_${timestamp}.mp4`);
    
    console.log('SRT path:', srtPath);
    console.log('Output path:', outputPath);

    // Convert segments to SRT format with chunking
    await VideoSubtitleProcessor.convertSegmentsToSRT(subtitleSegments, srtPath, maxWordsPerChunk);
    console.log(`✅ SRT file created with ${maxWordsPerChunk}-word chunks`);    // Validate input files exist
    await VideoSubtitleProcessor.validateInputFiles(fullVideoPath, srtPath);
    console.log('✅ Input files validated');

    // Process video with subtitles
    const finalOutputPath = await VideoSubtitleProcessor.addSubtitlesToVideo({
      inputVideoPath: fullVideoPath,
      outputVideoPath: outputPath,
      subtitlePath: srtPath,
      style: {
        fontSize: 28,
        fontColor: 'white',
        backgroundColor: 'black@0.8',
        outlineColor: 'black',
        outlineWidth: 2,
        position: 'bottom',
        marginVertical: 60
      },
      onProgress: (progress) => {
        console.log(`Progress: ${progress}%`);
      }
    });

    console.log('✅ Video processing completed');
    console.log('Final output:', finalOutputPath);

    // Clean up temporary files
    try {
      await import('fs/promises').then(fs => fs.unlink(srtPath));
      console.log('✅ Temporary SRT file cleaned up');
    } catch (error) {
      console.warn('Could not clean up SRT file:', error);
    }

    try {
      if (fs.existsSync(audioPath)) {
        await import('fs/promises').then(fs => fs.unlink(audioPath));
        console.log('✅ Temporary audio file cleaned up');
      }
    } catch (error) {
      console.warn('Could not clean up audio file:', error);
    }

    // Return relative path for frontend
    const relativePath = path.relative(publicDir, finalOutputPath);

    return NextResponse.json({
      success: true,
      outputPath: `/${relativePath.replace(/\\/g, '/')}`, // Ensure forward slashes
      message: 'Subtitles added successfully!'
    });

  } catch (error) {
    console.error('=== Subtitle Processing Error ===');
    console.error('Error:', error);
    
    let errorMessage = 'Failed to add subtitles to video';
    
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('429')) {
        errorMessage = 'OpenAI API quota exceeded. Please try again later.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key is missing or invalid.';
      } else if (error.message.includes('transcription')) {
        errorMessage = 'Failed to transcribe audio. Please check your video format.';
      }
    }
    
    return NextResponse.json({
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
