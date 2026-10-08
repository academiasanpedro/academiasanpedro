// Divisor con texto centrado (p. ej. "o continúa con")

export default function DividerWithText({ text = "o" }: { text?: string }) {
  return (
    <div className="flex items-center gap-4 py-1" role="separator">
      <div className="h-px flex-1 bg-neutral-200" />
      <span className="shrink-0 text-xs font-semibold tracking-wide text-neutral-400 uppercase">{text}</span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
