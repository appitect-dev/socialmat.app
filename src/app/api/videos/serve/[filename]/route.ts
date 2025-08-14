import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const tempDir = path.join(process.cwd(), 'temp', 'videos')
    const filePath = path.join(tempDir, filename)

    // Security check - ensure file is within temp directory
    const resolvedPath = path.resolve(filePath)
    const resolvedTempDir = path.resolve(tempDir)
    
    if (!resolvedPath.startsWith(resolvedTempDir)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      )
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read file
    const file = fs.readFileSync(filePath)
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.mp4':
        contentType = 'video/mp4'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.srt':
        contentType = 'text/plain'
        break
      case '.vtt':
        contentType = 'text/vtt'
        break
    }

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': file.length.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
