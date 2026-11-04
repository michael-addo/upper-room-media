// Verse resolver: turns spoken phrases like
//   "Romans chapter twelve verse one"
// into { book, chapter, verse } and fetches the text.

export type ParsedVerse = {
  book: string;
  chapter: number;
  verse: number | null;
  reference: string; // e.g. "Romans 12:1"
};

const BOOKS: Record<string, string> = {
  genesis: "Genesis", exodus: "Exodus", leviticus: "Leviticus",
  numbers: "Numbers", deuteronomy: "Deuteronomy", joshua: "Joshua",
  judges: "Judges", ruth: "Ruth", "1 samuel": "1 Samuel", "2 samuel": "2 Samuel",
  "1 kings": "1 Kings", "2 kings": "2 Kings", "1 chronicles": "1 Chronicles",
  "2 chronicles": "2 Chronicles", ezra: "Ezra", nehemiah: "Nehemiah",
  esther: "Esther", job: "Job", psalms: "Psalms", proverbs: "Proverbs",
  ecclesiastes: "Ecclesiastes", "song of solomon": "Song of Solomon",
  isaiah: "Isaiah", jeremiah: "Jeremiah", lamentations: "Lamentations",
  ezekiel: "Ezekiel", daniel: "Daniel", hosea: "Hosea", joel: "Joel",
  amos: "Amos", obadiah: "Obadiah", jonah: "Jonah", micah: "Micah",
  nahum: "Nahum", habakkuk: "Habakkuk", zephaniah: "Zephaniah",
  haggai: "Haggai", zechariah: "Zechariah", malachi: "Malachi",
  matthew: "Matthew", mark: "Mark", luke: "Luke", john: "John",
  acts: "Acts", romans: "Romans", "1 corinthians": "1 Corinthians",
  "2 corinthians": "2 Corinthians", galatians: "Galatians",
  ephesians: "Ephesians", philippians: "Philippians",
  colossians: "Colossians", "1 thessalonians": "1 Thessalonians",
  "2 thessalonians": "2 Thessalonians", "1 timothy": "1 Timothy",
  "2 timothy": "2 Timothy", titus: "Titus", philemon: "Philemon",
  hebrews: "Hebrews", "1 peter": "1 Peter", "2 peter": "2 Peter",
  "1 john": "1 John", "2 john": "2 John", "3 john": "3 John",
  jude: "Jude", revelation: "Revelation",
  // Spoken forms ("First Corinthians", "Second Kings", ...)
  "first corinthians": "1 Corinthians", "second corinthians": "2 Corinthians",
  "first samuel": "1 Samuel", "second samuel": "2 Samuel",
  "first kings": "1 Kings", "second kings": "2 Kings",
  "first chronicles": "1 Chronicles", "second chronicles": "2 Chronicles",
  "first thessalonians": "1 Thessalonians", "second thessalonians": "2 Thessalonians",
  "first timothy": "1 Timothy", "second timothy": "2 Timothy",
  "first peter": "1 Peter", "second peter": "2 Peter",
  "first john": "1 John", "second john": "2 John", "third john": "3 John",
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

function toNumber(token: string): number | null {
  if (/^\d+$/.test(token)) return parseInt(token, 10);
  // Word form: "twenty three" → 23, "twelve" → 12
  const parts = token.toLowerCase().split(/[\s-]+/);
  let total = 0;
  for (const p of parts) {
    if (p === "") continue;
    if (NUMBER_WORDS[p] === undefined) return null;
    total += NUMBER_WORDS[p];
  }
  return total || null;
}

export function parseSpokenReference(text: string): ParsedVerse | null {
  const t = text.toLowerCase().trim();

  // Find the earliest book name in the text
  let bestBook: string | null = null;
  let bestIdx = Infinity;
  for (const key of Object.keys(BOOKS)) {
    const idx = t.indexOf(key);
    if (idx === -1) continue;
    if (idx < bestIdx) {
      bestIdx = idx;
      bestBook = key;
    }
  }
  if (!bestBook) return null;

  // Number tokens are words or digits, but must stop before the other marker
  // (e.g. the chapter number must not swallow "verse one").
  const NUM = "(?:[a-z0-9]+(?:-(?:[a-z0-9]+))?)";
  const chapterMatch = t.match(
    new RegExp(
      `\\b(chapter|chap)\\s+((?!verse\\b)${NUM}(?:\\s+(?!verse\\b)${NUM})*)\\b`
    )
  );
  const verseMatch = t.match(
    new RegExp(
      `\\b(verse|verses|v)\\s+((?!chapter\\b)${NUM}(?:\\s+(?!chapter\\b)${NUM})*)\\b`
    )
  );

  // Bare numeric form: "Romans 12:1", "Romans 12 1"
  const numericMatch = t.match(
    new RegExp(
      `\\b${NUM}\\s+(\\d+)\\s*:?\\s*(\\d+)?\\b`
    )
  );

  let chapterStr: string | null = null;
  let verseStr: string | null = null;
  if (chapterMatch && verseMatch) {
    chapterStr = chapterMatch[2];
    verseStr = verseMatch[2];
  } else if (numericMatch) {
    chapterStr = numericMatch[1];
    verseStr = numericMatch[2] ?? null;
  }

  const chapter = chapterStr ? toNumber(chapterStr) : null;
  const verse = verseStr ? toNumber(verseStr) : null;

  if (chapter === null) return null;

  return {
    book: BOOKS[bestBook],
    chapter,
    verse,
    reference: verse ? `${BOOKS[bestBook]} ${chapter}:${verse}` : `${BOOKS[bestBook]} ${chapter}`,
  };
}

// A small fallback corpus so the demo works without an external API key.
const FALLBACK: Record<string, string> = {
  "Romans 12:1":
    "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
  "John 3:16":
    "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  "Psalm 23:1":
    "The LORD is my shepherd; I shall not want.",
};

export async function fetchVerseText(reference: string): Promise<string | null> {
  if (FALLBACK[reference]) return FALLBACK[reference];

  // Optional: Bible API (https://bible-api.com). No key required.
  try {
    const [book, ch, v] = reference.split(/[\s:]+/);
    const ref = `${book}+${ch}:${v}`;
    const res = await fetch(
      `https://bible-api.com/${encodeURIComponent(ref)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = Array.isArray(data?.text)
      ? data.text.map((s: string) => s.trim()).join(" ")
      : data?.text;
    return text ? text.trim() : null;
  } catch {
    return null;
  }
}