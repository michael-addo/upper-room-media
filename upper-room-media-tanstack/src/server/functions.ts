import { createServerFn } from "@tanstack/react-start";
import { parseSpokenReference, fetchVerseText } from "#/lib/verse";
import { pushToScreen, getOnScreen, clearScreen } from "#/lib/store";
import type { OnScreen } from "#/lib/store";

// POST /api/detect — parse a spoken/typed reference and fetch its verse text
export const detectFn = createServerFn({ method: "POST" })
  .handler(async (data: { text: string }) => {
    const { text } = data;
    if (!text || typeof text !== "string") {
      throw new Error("text is required");
    }
    const parsed = parseSpokenReference(text);
    if (!parsed) {
      return { detected: false, text } as const;
    }
    const verseText = await fetchVerseText(parsed.reference);
    return {
      detected: true,
      reference: parsed.reference,
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
      text: verseText ?? null,
    } as const;
  });

// POST /api/push — set the verse currently shown on /present
export const pushFn = createServerFn({ method: "POST" }).handler(
  async (data: { reference: string; text: string }) => {
    const { reference, text } = data;
    if (!reference || !text) throw new Error("reference and text are required");
    pushToScreen(reference, text);
    return { ok: true } as const;
  }
);

// POST /api/clear — clear the live screen
export const clearFn = createServerFn({ method: "POST" }).handler(async () => {
  clearScreen();
  return { ok: true } as const;
});

// GET /api/current — what /present is currently showing
export const currentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ onScreen: OnScreen }> => {
    return { onScreen: getOnScreen() };
  }
);