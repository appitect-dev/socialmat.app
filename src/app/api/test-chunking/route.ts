import { NextResponse } from 'next/server';
import { VideoSubtitleProcessor } from '@/lib/videoSubtitleProcessor';

export async function GET() {
  try {
    // Sample subtitle segments with long text
    const sampleSegments = [
      {
        start: 0,
        end: 5,
        text: "This is a very long subtitle segment that should be broken down into smaller more readable chunks"
      },
      {
        start: 5,
        end: 8,
        text: "Short segment"
      },
      {
        start: 8,
        end: 15,
        text: "Another really long segment with many words that will definitely need to be chunked up for better readability"
      }
    ];

    console.log('=== Testing Subtitle Chunking ===');
    console.log('Original segments:', sampleSegments.length);
    
    // Test chunking with different word limits
    const chunked4Words = VideoSubtitleProcessor.breakIntoSmallChunks(sampleSegments, 4);
    const chunked3Words = VideoSubtitleProcessor.breakIntoSmallChunks(sampleSegments, 3);
    
    console.log('Chunked (4 words):', chunked4Words.length);
    console.log('Chunked (3 words):', chunked3Words.length);

    return NextResponse.json({
      success: true,
      original: sampleSegments,
      chunked4Words,
      chunked3Words,
      stats: {
        originalSegments: sampleSegments.length,
        chunked4WordsCount: chunked4Words.length,
        chunked3WordsCount: chunked3Words.length
      }
    });

  } catch (error) {
    console.error('Chunking test error:', error);
    return NextResponse.json({
      error: 'Failed to test chunking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
