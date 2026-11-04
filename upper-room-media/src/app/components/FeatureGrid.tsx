const features = [
  {
    icon: "🎙",
    title: "AI Bible Detection",
    body: "The preacher speaks. The system hears 'Romans chapter twelve verse one' and queues Romans 12:1 for the screen. No typing mid-service.",
  },
  {
    icon: "📺",
    title: "Live Presentation",
    body: "Scripture, lyrics, announcements and lower thirds pushed to the projector in real time. One operator, every output.",
  },
  {
    icon: "🎶",
    title: "Lyrics & Worship",
    body: "Store songs with their slides. Pull them up in seconds, step through verses, blank the screen when you need to.",
  },
  {
    icon: "🎛",
    title: "OBS Integration",
    body: "Drop the /present URL into OBS as a browser source. Optimized for clean 16:9 output with zero chrome.",
  },
  {
    icon: "🇬🇭",
    title: "Built for Ghana",
    body: "Low-internet friendly. Mobile-first operator controls. Your church, assembly, district and region, configurable.",
  },
  {
    icon: "🖥",
    title: "Multi-Screen",
    body: "Main projector, preacher confidence monitor and livestream each see what they need from one control room.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="mb-10 text-center font-display text-3xl">
        Everything a media team needs
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-6 transition hover:border-gold/40"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="mb-2 font-display text-xl text-gold-soft">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}