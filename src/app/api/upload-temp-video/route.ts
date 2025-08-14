import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    console.log('Saving video:', video.name, 'Size:', video.size);
    
    // Create temp directory path
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    
    // Ensure directory exists
    await import('fs/promises').then(fs => fs.mkdir(tempDir, { recursive: true }));
    
    // Save video to temp directory
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(tempDir, video.name);
    
    await writeFile(filePath, buffer);
    console.log('✅ Video saved to:', filePath);
    
    return NextResponse.json({
      success: true,
      filePath: `/temp/${video.name}`,
      message: 'Video uploaded successfully'
    });

  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json({
      error: 'Failed to save video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
