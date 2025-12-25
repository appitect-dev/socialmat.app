import { NextRequest, NextResponse } from "next/server";

// Mock AI response - v produkci by to volalo OpenAI API
async function generateAIResponse(
  prompt: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  // Simulace AI odpovědi - v produkci použij OpenAI API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const context = conversationHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  // Mock odpovědi podle typu požadavku
  if (prompt.toLowerCase().includes("nápad") || prompt.toLowerCase().includes("téma")) {
    return `Tady jsou 3 nápady na obsah pro Instagram:

1. **"5 chyb, které dělá každý začátečník"**
   - Hook: "Dělal jsem VŠECHNY tyto chyby..."
   - Formát: Carousel s tipy
   - CTA: "Kterou z těchto chyb děláš ty?"

2. **"Behind the scenes" série**
   - Hook: "Nikdo ti neřekne, jak to doopravdy vypadá..."
   - Formát: Reels s hudbou
   - CTA: "Sdílej svůj behind the scenes!"

3. **"Transformation story"**
   - Hook: "Před 6 měsíci jsem byl na nule..."
   - Formát: Před/Po + Story
   - CTA: "Chceš vidět celý proces?"

Který nápad tě zaujal? Můžu ho rozepsat víc do detailu!`;
  } else if (prompt.toLowerCase().includes("hook")) {
    return `3 silné hooky pro tvůj post:

🎯 **Hook 1 (Kontroverzní)**
"Nikdo ti neřekne tuhle pravdu o [tvoje téma]..."
→ Funguje na zvědavost + vytváří napětí

🎯 **Hook 2 (Osobní story)**
"Před rokem jsem udělal největší chybu svého života..."
→ Vytváří emocionální spojení

🎯 **Hook 3 (Hodnota hned na začátku)**
"3 věci, které jsem se naučil za 10 let..."
→ Jasná hodnota, lidé chtějí číst dál

Který hook se ti líbí? Můžu napsat celý caption!`;
  } else if (prompt.toLowerCase().includes("caption") || prompt.toLowerCase().includes("text")) {
    return `Tady je kompletní caption:

---

Nikdo ti neřekně tuhle pravdu o růstu na Instagramu... 🔥

Myslel jsem si, že stačí postovat každý den. Že stačí kvalitní obsah. Že to časem "nějak vyjde".

A víš co? Byl jsem na tom úplně špatně.

Po 2 letech zkoušení a testování jsem konečně pochopil, co SKUTEČNĚ funguje:

✨ Není to o tom kolikrát postuješ
✨ Není to o tom jak drahá máš kameru
✨ Není to ani o tom kolik hashtagů použiješ

Je to o jedné jediné věci: KONVERZI.

Každý tvůj post musí někoho přimět k akci:
→ Follow
→ Like
→ Komentář
→ Share
→ Kliknutí na link

A na to potřebuješ 3 věci:
1. Hook, který zastaví scroll
2. Hodnotu, která lidi udrží
3. CTA, které je přiměje k akci

Používáš tohle ve svém obsahu? 👇

---

Co říkáš? Chceš upravit nějakou část?`;
  } else if (prompt.toLowerCase().includes("plán") || prompt.toLowerCase().includes("kalendář")) {
    return `Content plan na celý měsíc:

📅 **TÝDEN 1 - Edukační obsah**
Po: Carousel "5 tipů pro..."
St: Reels tutorial
Pá: Behind the scenes

📅 **TÝDEN 2 - Engagement**
Po: Otázka pro komunitu
St: Poll Story série
Pá: User generated content

📅 **TÝDEN 3 - Hodnota**
Po: Case study/transformation
St: Reels hack/tip
Pá: Mini workshop (carousels)

📅 **TÝDEN 4 - Prodej/CTA**
Po: Testimonial post
St: Limitovaná nabídka
Pá: FAQ + CTA

Chceš rozepsat konkrétní týden do detailu?`;
  }

  return `Zajímavý dotaz! Můžu ti pomoci s:

• Generování nápadů na obsah
• Psaním hooků a captionů
• Vytvořením content plánu
• Analýzou engagement strategie
• Návrhy na Stories
• Timing publikování

Co tě zajímá nejvíc?`;
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
