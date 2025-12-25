import { NextRequest, NextResponse } from "next/server";

const mockSessions: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = mockSessions[params.id];

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { messages, title } = await request.json();
    const session = mockSessions[params.id];

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (messages) session.messages = messages;
    if (title) session.title = title;
    session.updatedAt = new Date().toISOString();

    mockSessions[params.id] = session;

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!mockSessions[params.id]) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    delete mockSessions[params.id];

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
