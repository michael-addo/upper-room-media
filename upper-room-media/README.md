# Upper Room Media

An AI-powered church presentation system — a local replica of the live site at
[macaly.app](https://ae6a3s9ttpgbdxvjx65rzek0.macaly.app/).

The preacher says a reference once; the system hears it, resolves the verse, and
pushes it to the screen before the congregation finds the page.

## Routes

| Route            | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `/`              | Landing page (hero, features, CTA)                 |
| `/dashboard`     | Control room — mic detection, queue, push to screen |
| `/present`       | OBS browser source — clean 16:9, zero chrome       |
| `/api/detect`    | `POST {text}` → parsed reference + verse text      |
| `/api/push`      | `POST {reference, text}` → sets the live screen    |
| `/api/clear`     | `POST` → clears the live screen                    |
| `/api/current`   | `GET` → what `/present` is showing                  |

## Getting started

```bash
cp .env.example .env   # add STT/Bible keys if you have them
npm install
npm run dev           # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## How the detection works

`src/app/lib/verse.ts` parses spoken references like:

- "Romans chapter twelve verse one" → `Romans 12:1`
- "First Corinthians chapter thirteen verse four" → `1 Corinthians 13:4`
- "John 3:16" → `John 3:16`

It then fetches the verse text from the free Bible API, with a small fallback
corpus (Romans 12:1, John 3:16, Psalm 23:1) so the demo works offline.

The dashboard uses the browser's Web Speech API as a stand-in for the mic. In
production this would be replaced by a real STT provider (OpenAI Whisper,
Deepgram, or AssemblyAI) — set `STT_PROVIDER` and `OPENAI_API_KEY` in `.env`.

## Deploy

Push to a Vercel project and it deploys as-is (Next.js App Router, zero config).