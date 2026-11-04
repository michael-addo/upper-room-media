"use client";

import { useState } from "react";
import Link from "next/link";

type Detection = {
  detected: boolean;
  reference?: string;
  text?: string | null;
};

export default function Dashboard() {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle — say a reference to begin");
  const [last, setLast] = useState<Detection | null>(null);
  const [transcript, setTranscript] = useState("");
  const [manual, setManual] = useState("");

  // Browser Web Speech API simulation of the spoken reference.
  // In production this would be replaced by a real STT provider (Whisper/Deepgram).
  const listen = () => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setStatus("Speech recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setListening(true);
      setStatus("Listening… say a Bible reference");
    };
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      detect(t);
    };
    rec.onerror = () => {
      setListening(false);
      setStatus("Recognition error — try again");
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  const detect = async (spoken: string) => {
    setStatus("Detecting…");
    const res = await fetch("/api/detect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: spoken }),
    });
    const data = await res.json();
    setLast(data);
    if (data.detected) {
      setStatus(`Detected ${data.reference} → queued for screen`);
    } else {
      setStatus("Could not parse a reference from that phrase");
    }
  };

  const pushToScreen = async () => {
    if (!last?.detected || !last.text) return;
    await fetch("/api/push", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference: last.reference, text: last.text }),
    });
    setStatus(`Pushed ${last.reference} to the screen`);
  };

  const clearScreen = async () => {
    await fetch("/api/clear", { method: "POST" });
    setStatus("Screen cleared");
  };

  const submitManual = async () => {
    if (!manual.trim()) return;
    await detect(manual.trim());
    setManual("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground glow-gold">
            UR
          </div>
          <div>
            <div className="font-display text-lg leading-tight tracking-wide">
              UPPER ROOM MEDIA
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Control Room
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              listening
                ? "bg-gold/20 text-gold"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full bg-gold ${
                listening ? "animate-pulse-gold" : ""
              }`}
            />
            {listening ? "LIVE" : "OFFLINE"}
          </span>
          <Link
            href="/present"
            className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            View live output
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8">
          <h1 className="font-display text-4xl">Control Room</h1>
          <p className="mt-2 text-muted-foreground">
            Say a Bible reference or type one. The AI detector resolves it and
            queues the verse for the screen.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Detection panel */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-xl text-gold-soft">
              AI Scripture Detection
            </h2>

            <button
              onClick={listen}
              disabled={listening}
              className={`w-full rounded-lg px-6 py-4 font-semibold transition disabled:opacity-50 ${
                listening
                  ? "bg-gold/20 text-gold"
                  : "bg-primary text-primary-foreground shadow-lg shadow-gold/20 hover:brightness-110"
              }`}
            >
              {listening ? "Listening…" : "🎤 Say a reference"}
            </button>

            <div className="mt-4 flex gap-2">
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitManual()}
                placeholder='e.g. "Romans chapter twelve verse one"'
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={submitManual}
                className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
              >
                Queue
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </div>
              <p className="mt-1 text-foreground">{status}</p>
              {transcript && (
                <p className="mt-2 text-muted-foreground">
                  Heard: “{transcript}”
                </p>
              )}
            </div>
          </section>

          {/* Live preview */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-xl text-gold-soft">
              Queued for screen
            </h2>
            {last?.detected ? (
              <div className="rounded-xl border border-gold/25 bg-royal-deep p-6">
                <div className="text-sm text-muted-foreground">
                  {last.reference}
                </div>
                <p className="mt-3 font-display text-2xl leading-relaxed text-heaven">
                  {last.text ?? "Fetching verse text…"}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={pushToScreen}
                    className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Push to screen
                  </button>
                  <button
                    onClick={clearScreen}
                    className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[160px] items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
                Nothing queued yet
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}