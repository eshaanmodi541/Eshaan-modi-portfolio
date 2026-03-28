"use client";

export function CircuitTraceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="w-full h-full opacity-100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal traces */}
        <line x1="0" y1="15%" x2="100%" y2="15%" stroke="var(--color-trace)" strokeWidth="1" />
        <line x1="0" y1="45%" x2="100%" y2="45%" stroke="var(--color-trace)" strokeWidth="1" />
        <line x1="0" y1="78%" x2="100%" y2="78%" stroke="var(--color-trace)" strokeWidth="1" />

        {/* Vertical traces */}
        <line x1="20%" y1="0" x2="20%" y2="100%" stroke="var(--color-trace)" strokeWidth="1" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="var(--color-trace)" strokeWidth="1" />

        {/* Junction pads */}
        <circle cx="20%" cy="15%" r="3" fill="var(--color-trace-glow)" />
        <circle cx="20%" cy="45%" r="4" fill="var(--color-trace-glow)" />
        <circle cx="75%" cy="45%" r="3" fill="var(--color-trace-glow)" />
        <circle cx="75%" cy="78%" r="4" fill="var(--color-trace-glow)" />
        <circle cx="20%" cy="78%" r="3" fill="var(--color-trace-glow)" />

        {/* Corner traces */}
        <polyline
          points="20%,15% 30%,15% 30%,25%"
          fill="none"
          stroke="var(--color-trace)"
          strokeWidth="1"
        />
        <polyline
          points="75%,45% 85%,45% 85%,55%"
          fill="none"
          stroke="var(--color-trace)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function CircuitDivider() {
  return (
    <div className="relative my-16">
      <svg width="100%" height="12" viewBox="0 0 800 12" preserveAspectRatio="none">
        <line x1="0" y1="6" x2="800" y2="6" stroke="var(--color-border-primary)" strokeWidth="1" />
        <circle cx="100" cy="6" r="4" fill="var(--color-bg-primary)" stroke="var(--color-trace-glow)" strokeWidth="1.5" />
        <circle cx="100" cy="6" r="1.5" fill="var(--color-accent)" />
        <circle cx="400" cy="6" r="4" fill="var(--color-bg-primary)" stroke="var(--color-trace-glow)" strokeWidth="1.5" />
        <circle cx="400" cy="6" r="1.5" fill="var(--color-accent)" />
        <circle cx="700" cy="6" r="4" fill="var(--color-bg-primary)" stroke="var(--color-trace-glow)" strokeWidth="1.5" />
        <circle cx="700" cy="6" r="1.5" fill="var(--color-accent)" />
      </svg>
    </div>
  );
}
