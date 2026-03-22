interface MediaMarqueeTextProps {
  text: string;
  className: string;
  threshold?: number;
}

export function MediaMarqueeText({ text, className, threshold = 22 }: MediaMarqueeTextProps) {
  const shouldMarquee = text.length > threshold;

  if (!shouldMarquee) {
    return <div className={`truncate ${className}`}>{text}</div>;
  }

  return (
    <div className="overflow-hidden">
      <div
        className={`flex min-w-max items-center whitespace-nowrap motion-safe:animate-[media-track-marquee_18s_linear_infinite] ${className}`}
      >
        <span>{text}</span>
        <span className="px-6 opacity-50">•</span>
        <span>{text}</span>
      </div>
      <style>{`
        @keyframes media-track-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
