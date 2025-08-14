import { NextResponse } from 'next/server';
import { VideoSubtitleProcessor } from '@/lib/videoSubtitleProcessor';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { videoPath, wordsPerChunk = 4 } = await request.json();
    
    if (!videoPath) {
      return NextResponse.json({ 
        error: 'videoPath is required' 
      }, { status: 400 });
    }

    // Validate words per chunk is in the 3-5 range
    const validWordsPerChunk = Math.max(3, Math.min(5, wordsPerChunk));

    console.log(`=== Quick Chunked Subtitles Test (${validWordsPerChunk} words) ===`);
    console.log('Video path:', videoPath);

    // Convert relative path to absolute path
    const fullVideoPath = videoPath.startsWith('/') 
      ? path.join(process.cwd(), 'public', videoPath.substring(1))
      : path.join(process.cwd(), 'public', videoPath);

    console.log('Processing with chunking enabled...');
    
    // For demonstration, let's create a sample result showing what chunking would look like
    const sampleTranscription = "This is a sample of what your video transcription might look like when processed with our chunking system that breaks long sentences into smaller readable parts";
    
    const sampleSegments = [{
      start: 0,
      end: 10,
      text: sampleTranscription
    }];

    const chunkedSegments = VideoSubtitleProcessor.breakIntoSmallChunks(sampleSegments, validWordsPerChunk);
    
    console.log(`✅ Original 1 segment became ${chunkedSegments.length} smaller chunks`);

    return NextResponse.json({
      success: true,
      message: `Subtitle chunking configured for ${validWordsPerChunk} words per subtitle`,
      demo: {
        originalText: sampleTranscription,
        originalSegments: 1,
        chunkedSegments: chunkedSegments.length,
        chunks: chunkedSegments.map((chunk, i) => ({
          number: i + 1,
          text: chunk.text,
          duration: `${chunk.start.toFixed(1)}s - ${chunk.end.toFixed(1)}s`
        }))
      }
    });

  } catch (error) {
    console.error('Quick chunked test error:', error);
    return NextResponse.json({
      error: 'Failed to test chunked subtitles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
