import { NextResponse } from "next/server";
import { SpeechToTextService } from "@/lib/speechToText";

export async function POST() {
  try {
    // Test the OpenAI API connection
    const speechService = new SpeechToTextService();
    
    // Create a simple test audio buffer (silence)
    const testBuffer = Buffer.alloc(1024);
    
    // Get API key status
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured",
        hint: "Add OPENAI_API_KEY to your .env.local file"
      });
    }

    // Try a small transcription test
    try {
      await speechService.transcribeAudio(testBuffer, 'test.mp3');
      return NextResponse.json({
        success: true,
        message: "OpenAI Whisper API is ready!",
        apiKeyConfigured: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({
        success: false,
        error: "API test failed",
        details: errorMessage,
        hint: "Check if your OpenAI API key is valid and has credits"
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: "Test endpoint error",
      details: errorMessage
    }, { status: 500 });
  }
}
