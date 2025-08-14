import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const fs = await import('fs/promises');
    const publicDir = path.join(process.cwd(), 'public');
    
    console.log('🔍 Searching for IMG_6873 files...');
    
    // Check all possible locations
    const locations = [
      path.join(publicDir, 'temp'),
      path.join(publicDir, 'processed'),
      path.join(process.cwd(), 'temp'),
      path.join(process.cwd(), 'temp/transcription-test')
    ];
    
    const foundFiles = [];
    
    for (const location of locations) {
      try {
        console.log('Checking:', location);
        const exists = await fs.access(location).then(() => true).catch(() => false);
        
        if (exists) {
          const files = await fs.readdir(location);
          const img6873Files = files.filter(file => file.includes('IMG_6873'));
          
          for (const file of img6873Files) {
            const fullPath = path.join(location, file);
            const stats = await fs.stat(fullPath);
            
            foundFiles.push({
              name: file,
              location: location,
              size: stats.size,
              relativePath: path.relative(publicDir, fullPath),
              fullPath: fullPath
            });
          }
        } else {
          console.log('Directory does not exist:', location);
        }
      } catch (error) {
        console.log('Error checking location', location, ':', error);
      }
    }
    
    // Also check if the processed directory needs to be created
    const processedDir = path.join(publicDir, 'processed');
    try {
      await fs.access(processedDir);
      console.log('✅ Processed directory exists');
    } catch {
      console.log('📁 Creating processed directory...');
      await fs.mkdir(processedDir, { recursive: true });
      console.log('✅ Processed directory created');
    }
    
    return NextResponse.json({
      success: true,
      foundFiles,
      totalFiles: foundFiles.length,
      searchedLocations: locations,
      message: foundFiles.length > 0 
        ? `Found ${foundFiles.length} IMG_6873 files`
        : 'No IMG_6873 files found in any location'
    });
    
  } catch (error) {
    console.error('Error searching for files:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search for files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
