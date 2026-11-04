import { Link, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureGrid } from "@/components/FeatureGrid";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% -10%, hsl(var(--card-glow)), transparent 60%), radial-gradient(900px 500px at 90% 10%, hsl(220 72% 35% / 0.25), transparent 55%)",
        }}
      />

      <Header />

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            AI-Powered Church Presentation
          </div>
          <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-balance md:text-6xl">
            Turn spoken Bible references into on-screen Scripture in seconds
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            The preacher says it once. Upper Room Media hears the reference,
            fetches the verse and puts it on the screen before the
            congregation finds the page.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-gold/20 transition hover:brightness-110"
            >
              GET STARTED
            </Link>
            <Link
              to="/present"
              className="rounded-lg border border-border px-8 py-3.5 font-semibold transition hover:bg-secondary"
            >
              VIEW LIVE OUTPUT
            </Link>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border bg-card p-6 text-left shadow-xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </div>
            <p className="font-display text-xl text-heaven">
              “Church, please open your Bibles to{" "}
              <span className="text-gold">Romans chapter twelve verse one</span>.”
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="rounded bg-gold/15 px-3 py-1 font-semibold text-gold">
                Detected: Romans 12:1
              </span>
              <span className="text-muted-foreground">
                → displayed on screen instantly
              </span>
            </div>
          </div>
        </section>

        <FeatureGrid />

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-2xl border border-gold/25 bg-royal-deep p-10 text-center">
            <h2 className="font-display text-3xl">Ready for Sunday?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Open the control room, start the service, and let the AI detector
              handle the Scripture.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-block rounded-lg bg-primary px-10 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-gold/20 transition hover:brightness-110"
            >
              OPEN THE CONTROL ROOM
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}