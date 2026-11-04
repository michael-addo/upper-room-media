// In-memory "current verse on screen" store.
// In production this would be Redis / Vercel KV / a database.
export type OnScreen = {
  reference: string;
  text: string;
  pushedAt: number;
} | null;

let current: OnScreen = null;

export function pushToScreen(reference: string, text: string) {
  current = { reference, text, pushedAt: Date.now() };
}

export function getOnScreen(): OnScreen {
  return current;
}

export function clearScreen() {
  current = null;
}