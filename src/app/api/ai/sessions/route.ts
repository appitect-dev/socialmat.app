import { NextRequest, NextResponse } from "next/server";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Mock database - v produkci by to bylo uložené v databázi
const mockSessions: Record<string, Session> = {};

export async function GET(request: NextRequest) {
  try {
    // V produkci by se získal userId z session/JWT
    const userId = "mock-user-123";

    // Získání všech sessions pro uživatele
    const userSessions = Object.values(mockSessions).filter(
      (session) => session.userId === userId
    );

    // Seřazení podle data
    const sortedSessions = userSessions.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({
      sessions: sortedSessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, messages } = await request.json();
    const userId = "mock-user-123";
    const sessionId = `session-${Date.now()}`;

    const newSession = {
      id: sessionId,
      userId,
      title: title || "Nová konverzace",
      messages: messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSessions[sessionId] = newSession;

    return NextResponse.json({
      session: newSession,
    });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
