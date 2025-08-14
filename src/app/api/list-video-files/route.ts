import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const tempDir = path.join(publicDir, 'temp');
    const processedDir = path.join(publicDir, 'processed');
    
    console.log('Checking directories...');
    console.log('Public dir:', publicDir);
    console.log('Temp dir:', tempDir);
    console.log('Processed dir:', processedDir);
    
    const fs = await import('fs/promises');
    
    // Get files from temp directory
    let tempFiles: string[] = [];
    try {
      const tempDirContents = await fs.readdir(tempDir);
      tempFiles = tempDirContents.filter(file => file.endsWith('.mp4') || file.endsWith('.srt'));
      console.log('Temp files:', tempFiles);
    } catch (error) {
      console.log('Temp directory not found or empty');
    }
    
    // Get files from processed directory  
    let processedFiles: string[] = [];
    try {
      const processedDirContents = await fs.readdir(processedDir);
      processedFiles = processedDirContents.filter(file => file.endsWith('.mp4') || file.endsWith('.srt'));
      console.log('Processed files:', processedFiles);
    } catch (error) {
      console.log('Processed directory not found or empty');
    }
    
    // Get file sizes
    const fileDetails = [];
    
    for (const file of tempFiles) {
      try {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        fileDetails.push({
          name: file,
          path: `/temp/${file}`,
          size: stats.size,
          directory: 'temp'
        });
      } catch (error) {
        console.log(`Could not stat temp file ${file}:`, error);
      }
    }
    
    for (const file of processedFiles) {
      try {
        const filePath = path.join(processedDir, file);
        const stats = await fs.stat(filePath);
        fileDetails.push({
          name: file,
          path: `/processed/${file}`,
          size: stats.size,
          directory: 'processed'
        });
      } catch (error) {
        console.log(`Could not stat processed file ${file}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      files: fileDetails,
      summary: {
        tempFiles: tempFiles.length,
        processedFiles: processedFiles.length,
        totalFiles: fileDetails.length
      }
    });
    
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to list files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
