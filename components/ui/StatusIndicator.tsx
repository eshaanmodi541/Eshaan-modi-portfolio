export function StatusIndicator({
  color,
  label,
}: {
  color: "green" | "yellow" | "red";
  label: string;
}) {
  const dotColors = {
    green: "bg-success",
    yellow: "bg-accent",
    red: "bg-error",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dotColors[color]}`} />
      <span className="font-mono text-xs text-fg-secondary">{label}</span>
    </div>
  );
}
