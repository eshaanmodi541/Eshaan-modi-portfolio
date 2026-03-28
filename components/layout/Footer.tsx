import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/eshaanmodi541", icon: "GH" },
  { label: "LinkedIn", href: "#", icon: "LI" },
  { label: "Email", href: "mailto:hello@example.com", icon: "@" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-primary mt-24 mb-16 md:mb-0">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="font-mono text-xs text-fg-tertiary">
          &copy; {new Date().getFullYear()} Eshaan Modi
        </span>

        {/* Decorative trace */}
        <svg
          width="80"
          height="8"
          viewBox="0 0 80 8"
          className="hidden sm:block"
        >
          <line
            x1="0"
            y1="4"
            x2="80"
            y2="4"
            stroke="var(--color-trace-glow)"
            strokeWidth="1"
          />
          <circle cx="8" cy="4" r="3" fill="var(--color-trace-glow)" />
          <circle cx="40" cy="4" r="2" fill="var(--color-accent)" />
          <circle cx="72" cy="4" r="3" fill="var(--color-trace-glow)" />
        </svg>

        <div className="flex gap-4">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-fg-tertiary hover:text-accent transition-colors"
              aria-label={s.label}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
