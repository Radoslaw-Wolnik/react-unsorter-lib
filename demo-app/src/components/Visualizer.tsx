import { ProgressBar }   from "./ProgressBar";
import { VisualizerBar } from "./VisualizerBar";

type Props = {
  data:          number[];
  activeIndices: [number, number] | null;
  mode:          "instant" | "trace";
  stepIndex:     number;
  totalSteps:    number;
  playing:       boolean;
  nextStep:      { i: number; j: number } | null;
  progress:      number;
};

export default function Visualizer({
  data,
  activeIndices,
  mode,
  stepIndex,
  totalSteps,
  playing,
  nextStep,
  progress,
}: Props) {
  const max = Math.max(...data, 1);

  return (
    <div className="viz-shell flex h-full flex-col">
      {/* top-edge glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[--color-primary]/30 to-transparent" />

      {/* header row */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 p-4 pb-3">
        <div>
          <p className="kicker">Visualizer</p>
          <p className="mt-1 text-xs text-[--color-muted]">
            {mode === "instant"
              ? "instant result"
              : playing
              ? "▶ playing trace"
              : "⏸ paused trace"}
          </p>
        </div>

        {mode === "trace" && (
          <ProgressBar
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            nextStep={nextStep}
            progress={progress}
          />
        )}
      </div>

      {/* bar chart stage — fills remaining height */}
      <div className="viz-stage mx-4 mb-4 flex-1">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-[--color-muted]">
            No data yet
          </div>
        ) : (
          <div className="flex h-full items-end gap-px">
            {data.map((value, index) => (
              <VisualizerBar
                key={index}
                heightPct={((value + 1) / (max + 1)) * 100}
                isFirst={activeIndices?.[0] === index}
                isSecond={activeIndices?.[1] === index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
