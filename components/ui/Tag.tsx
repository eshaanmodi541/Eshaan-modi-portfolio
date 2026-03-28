export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] text-accent bg-accent-muted border border-border-accent px-2 py-0.5 rounded">
      {children}
    </span>
  );
}
