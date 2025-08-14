import { NextRequest, NextResponse } from 'next/server'
import { AIContentGenerator } from '@/lib/aiContentGenerator'

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json()
    
    // Initialize AI content generator
    const aiGenerator = new AIContentGenerator()
    
    // Generate AI-powered video ideas
    const ideas = aiGenerator.generateVideoIdeas(category || 'trending', 3)

    // Simulate AI processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      ideas: ideas,
      metadata: {
        category: category || 'trending',
        generatedAt: new Date().toISOString(),
        aiModel: 'socialmat-v1.0'
      }
    })

  } catch (error) {
    console.error('Error generating video ideas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate video ideas' },
      { status: 500 }
    )
  }
}
