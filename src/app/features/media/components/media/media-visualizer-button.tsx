interface MediaVisualizerButtonProps {
  isPlaying: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const BAR_DELAYS = ['0ms', '180ms', '320ms', '120ms'];

export function MediaVisualizerButton({
  isPlaying,
  onClick,
  className = '',
}: MediaVisualizerButtonProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Open media details"
        onClick={onClick}
        className={`flex h-7 w-7 items-center justify-center ${className}`}
      >
        <span className="flex h-5 items-center gap-[3px]">
          {BAR_DELAYS.map((delay, index) => (
            <span
              key={delay}
              className={`media-visualizer-bar rounded-full bg-current ${
                isPlaying ? 'media-visualizer-bar-active' : ''
              } ${index === 1 ? 'h-5 w-[3px]' : index === 2 ? 'h-3 w-[3px]' : 'h-4 w-[3px]'}`}
              style={{ animationDelay: delay }}
            />
          ))}
        </span>
      </button>

      <style>
        {`
          @keyframes navet-media-visualizer {
            0%, 100% {
              transform: scaleY(0.4);
              opacity: 0.72;
            }
            50% {
              transform: scaleY(1);
              opacity: 1;
            }
          }

          .media-visualizer-bar {
            transform-origin: center;
          }

          .media-visualizer-bar-active {
            animation: navet-media-visualizer 920ms ease-in-out infinite;
          }
        `}
      </style>
    </>
  );
}
