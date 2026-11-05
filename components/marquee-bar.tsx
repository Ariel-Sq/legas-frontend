/**
 * Thin strip above the header with a message that scrolls sideways. No JS:
 * the movement is a CSS animation, so it costs nothing on the client.
 */
export function MarqueeBar({ text, speed }: { text: string; speed: number }) {
  const duration = Math.min(120, Math.max(10, Number(speed) || 40));
  const repetitions = 6;

  return (
    <div
      className="overflow-hidden bg-black text-white"
      role="status"
      aria-label={text}
    >
      <div
        className="marquee-track py-1.5 text-xs font-medium sm:text-sm"
        style={{ animationDuration: `${duration}s` }}
      >
        {Array.from({ length: repetitions }).map((_, index) => (
          <span key={index} className="mx-6 whitespace-nowrap">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
