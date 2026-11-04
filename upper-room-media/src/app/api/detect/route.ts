import { NextRequest, NextResponse } from "next/server";
import { parseSpokenReference, fetchVerseText } from "@/app/lib/verse";

// POST /api/detect  { text: "Romans chapter twelve verse one" }
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const parsed = parseSpokenReference(text);
    if (!parsed) {
      return NextResponse.json({ detected: false, text });
    }

    const verseText = await fetchVerseText(parsed.reference);

    return NextResponse.json({
      detected: true,
      reference: parsed.reference,
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
      text: verseText ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}