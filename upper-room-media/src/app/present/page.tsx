"use client";

import { useEffect, useState } from "react";
import type { OnScreen } from "@/app/lib/store";

// The OBS browser source. Clean 16:9, zero chrome.
export default function Present() {
  const [onScreen, setOnScreen] = useState<OnScreen>(null);

  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch("/api/current");
        const data = await res.json();
        setOnScreen(data.onScreen ?? null);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-deep p-8">
      <div className="w-full max-w-5xl text-center">
        {onScreen ? (
          <>
            <div className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
              {onScreen.reference}
            </div>
            <p className="font-display text-4xl leading-snug text-heaven md:text-6xl">
              {onScreen.text}
            </p>
          </>
        ) : (
          <div>
            <div className="font-display text-4xl text-muted-foreground md:text-6xl">
              Upper Room Media
            </div>
            <p className="mt-4 text-muted-foreground">
              Verse will appear here when the control room pushes one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}