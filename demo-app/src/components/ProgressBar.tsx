type Props = {
  stepIndex:  number;
  totalSteps: number;
  nextStep:   { i: number; j: number } | null;
  progress:   number;
};

export function ProgressBar({ stepIndex, totalSteps, nextStep, progress }: Props) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className="min-w-48">
      <div className="mb-2 flex items-center justify-between text-[11px] text-[--color-muted]">
        <span className="tabular-nums">
          {Math.min(stepIndex, totalSteps)} / {totalSteps}
        </span>
        {nextStep ? (
          <span className="flex items-center gap-1 font-mono">
            <span style={{ color: "var(--color-swap-a)" }}>
              {Math.min(nextStep.i, nextStep.j)}
            </span>
            <span className="text-[--color-muted]">↔</span>
            <span style={{ color: "var(--color-swap-b)" }}>
              {Math.max(nextStep.i, nextStep.j)}
            </span>
          </span>
        ) : (
          <span className="text-[--color-primary]/50">done</span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[--color-bg]/60">
        <div
          className="h-full rounded-full"
          style={{
            width: `${clamped}%`,
            background:
              "linear-gradient(90deg, var(--color-accent-dim), var(--color-accent))",
            transition: "width 80ms linear",
          }}
        />
      </div>
    </div>
  );
}
