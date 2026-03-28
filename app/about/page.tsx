import { CircuitDivider } from "@/components/ui/CircuitTrace";

export const metadata = { title: "About" };

const tools = [
  { name: "Python", category: "Language" },
  { name: "C/C++", category: "Language" },
  { name: "TypeScript", category: "Language" },
  { name: "Rust", category: "Language" },
  { name: "Arduino", category: "Hardware" },
  { name: "Raspberry Pi", category: "Hardware" },
  { name: "ESP32", category: "Hardware" },
  { name: "KiCad", category: "Design" },
  { name: "Git", category: "Tool" },
  { name: "Linux", category: "Platform" },
  { name: "React", category: "Framework" },
  { name: "Next.js", category: "Framework" },
];

const timeline = [
  {
    ref: "NOW",
    date: "2026 — present",
    title: "Building in public",
    desc: "Documenting projects and sharing what I learn.",
    active: true,
  },
  {
    ref: "EXP-01",
    date: "2025",
    title: "Your milestone here",
    desc: "Replace with a real milestone from your journey.",
    active: false,
  },
  {
    ref: "EXP-02",
    date: "2024",
    title: "Another milestone",
    desc: "Replace with another key moment.",
    active: false,
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-sans text-4xl font-bold tracking-tighter mb-8">
        About
      </h1>

      <div className="space-y-4 text-fg-secondary leading-relaxed max-w-lg">
        <p>
          Hi, I&apos;m <span className="text-fg-primary font-medium">Eshaan Modi</span> — an
          engineer who works across the full stack, from soldering iron to
          server rack.
        </p>
        <p>
          I&apos;m drawn to the places where hardware meets software: embedded
          systems, electronics, and the kind of engineering that involves both
          a multimeter and a code editor.
        </p>
      </div>

      <CircuitDivider />

      {/* Toolbox */}
      <section>
        <h2 className="font-mono text-xs text-fg-tertiary uppercase tracking-widest mb-6">
          Toolbox
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 hover:border-accent transition-colors group"
            >
              <div className="font-mono text-sm text-accent group-hover:text-accent-hover">
                {tool.name}
              </div>
              <div className="font-mono text-[10px] text-fg-tertiary uppercase tracking-wider mt-0.5">
                {tool.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CircuitDivider />

      {/* Timeline */}
      <section>
        <h2 className="font-mono text-xs text-fg-tertiary uppercase tracking-widest mb-8">
          Journey
        </h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-primary" />

          {timeline.map((item) => (
            <div key={item.ref} className="relative mb-8 last:mb-0">
              {/* Node */}
              <div
                className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 ${
                  item.active
                    ? "bg-accent border-accent shadow-[0_0_8px_var(--color-accent)]"
                    : "bg-bg-primary border-border-primary"
                }`}
              />
              <div className="font-mono text-[10px] text-fg-tertiary uppercase tracking-wider mb-1">
                <span className="text-accent mr-2">{item.ref}</span>
                {item.date}
              </div>
              <h3 className="font-sans font-semibold text-fg-primary mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-fg-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CircuitDivider />

      {/* Contact */}
      <section>
        <h2 className="font-mono text-xs text-fg-tertiary uppercase tracking-widest mb-4">
          Connect
        </h2>
        <div className="flex gap-6">
          <a
            href="https://github.com/eshaanmodi541"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-fg-secondary hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@example.com"
            className="font-mono text-sm text-fg-secondary hover:text-accent transition-colors"
          >
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
