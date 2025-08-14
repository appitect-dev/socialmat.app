import { NextRequest, NextResponse } from 'next/server'
import { AIContentGenerator } from '@/lib/aiContentGenerator'

export async function POST(request: NextRequest) {
  try {
    const { tone, topic } = await request.json()
    
    // Initialize AI content generator
    const aiGenerator = new AIContentGenerator()
    
    // Generate AI-powered captions
    const captions = aiGenerator.generateCaptions(tone || 'casual', topic, 3)

    // Simulate AI processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1200))

    return NextResponse.json({
      success: true,
      captions: captions,
      metadata: {
        tone: tone || 'casual',
        topic: topic || 'general',
        generatedAt: new Date().toISOString(),
        aiModel: 'socialmat-caption-v1.0'
      }
    })

  } catch (error) {
    console.error('Error generating captions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate captions' },
      { status: 500 }
    )
  }
}
