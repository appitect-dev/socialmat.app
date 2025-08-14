import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 7) + '...' : 'No key found',
    keyLength: apiKey ? apiKey.length : 0,
    envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
  });
}
