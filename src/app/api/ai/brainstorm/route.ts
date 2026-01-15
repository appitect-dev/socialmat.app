import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Inicializace OpenAI klienta
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt pro AI asistenta
const SYSTEM_PROMPT = `Jsi kreativní AI asistent specializovaný na tvorbu obsahu pro sociální sítě, zejména Instagram. Komunikuješ česky.

Tvoje hlavní schopnosti:
- Generování nápadů na obsah (Reels, Stories, Carousels, posty)
- Psaní poutavých hooků, které zastaví scroll
- Tvorba kompletních captionů s CTA
- Vytváření content plánů na týden/měsíc
- Návrhy hashtagů a strategií pro růst
- Analýza trendů a best practices

Pravidla:
- Odpovídej vždy česky
- Buď konkrétní a praktický
- Nabízej příklady a strukturované návrhy
- Ptej se na doplňující informace, pokud je potřebuješ
- Používej emoji střídmě pro lepší čitelnost
- Zaměř se na obsah, který generuje engagement`;

// Funkce pro generování AI odpovědi pomocí OpenAI
async function generateAIResponse(
  prompt: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  // Převod historie konverzace do formátu OpenAI
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: prompt },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.8,
    max_tokens: 1500,
  });

  return completion.choices[0]?.message?.content ?? "Omlouvám se, nepodařilo se vygenerovat odpověď.";
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const aiResponse = await generateAIResponse(
      message,
      conversationHistory || []
    );

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Brainstorming error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
