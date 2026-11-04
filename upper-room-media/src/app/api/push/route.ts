import { NextRequest, NextResponse } from "next/server";
import { pushToScreen } from "@/app/lib/store";

// POST /api/push { reference, text }
export async function POST(req: NextRequest) {
  try {
    const { reference, text } = await req.json();
    if (!reference || !text) {
      return NextResponse.json(
        { error: "reference and text are required" },
        { status: 400 }
      );
    }
    pushToScreen(reference, text);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}