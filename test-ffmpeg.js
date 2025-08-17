// Simple test to check ffmpeg-static
try {
  const ffmpegStatic = require('ffmpeg-static');
  console.log('FFmpeg static path:', ffmpegStatic);
  console.log('Type:', typeof ffmpegStatic);
  
  if (ffmpegStatic) {
    const fs = require('fs');
    const exists = fs.existsSync(ffmpegStatic);
    console.log('Binary exists:', exists);
    
    if (exists) {
      const stats = fs.statSync(ffmpegStatic);
      console.log('File size:', stats.size);
      console.log('Is executable:', !!(stats.mode & parseInt('111', 8)));
    }
  }
} catch (error) {
  console.error('Error loading ffmpeg-static:', error.message);
  console.error('Full error:', error);
}
