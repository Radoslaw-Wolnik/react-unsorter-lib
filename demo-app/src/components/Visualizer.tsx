import { ProgressBar } from "./ProgressBar";
import { VisualizerBar } from "./VisualizerBar";

type Props = {
  data: number[];
  activeIndices: [number, number] | null;
  mode: "instant" | "trace";
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  nextStep: { i: number; j: number } | null;
  progress: number;
};

export default function Visualizer({
  data,
  activeIndices,
  mode,
  stepIndex,
  totalSteps,
  nextStep,
  progress,
}: Props) {
  const max = Math.max(...data, 1);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[--color-panel] shadow-lg shadow-black/20">
      {mode === "trace" && (
        <div className="flex shrink-0 justify-end p-4 pb-3">
          <ProgressBar
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            nextStep={nextStep}
            progress={progress}
          />
        </div>
      )}

      <div className="relative m-4 flex-1 overflow-hidden rounded-xl border border-[--color-border-soft] bg-[--color-bg] p-2">
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
