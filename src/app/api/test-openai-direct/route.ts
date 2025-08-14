import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    console.log('=== OpenAI Direct Test Started ===');
    
    // Check if API key is present
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    console.log('API Key prefix:', apiKey?.substring(0, 20));
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'No API key found',
        env: process.env
      }, { status: 500 });
    }
    
    // Initialize OpenAI client
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Test 1: List models (simple GET request)
    console.log('Testing models.list()...');
    const modelsResponse = await openai.models.list();
    console.log('Models response received:', !!modelsResponse);
    
    // Test 2: Simple chat completion
    console.log('Testing chat completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello in 3 words" }],
      max_tokens: 10
    });
    console.log('Chat completion received:', !!completion);
    
    console.log('=== All tests passed! ===');
    
    return NextResponse.json({ 
      success: true,
      modelsCount: modelsResponse.data?.length || 0,
      chatResponse: completion.choices[0]?.message?.content || 'No response',
      message: 'OpenAI API is working correctly!'
    });
    
  } catch (err: unknown) {
    const error = err as { 
      name?: string; 
      message?: string; 
      status?: number; 
      type?: string; 
      code?: string; 
    };
    
    console.error('=== OpenAI Test Error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    console.error('Full error:', err);
    
    return NextResponse.json({ 
      error: 'OpenAI API test failed',
      details: {
        name: error.name,
        message: error.message,
        status: error.status,
        type: error.type,
        code: error.code
      }
    }, { status: 500 });
  }
}
