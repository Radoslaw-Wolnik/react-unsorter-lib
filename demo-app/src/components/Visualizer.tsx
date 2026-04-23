import { motion } from "framer-motion";

type Props = {
  data: number[];
  activeIndices?: [number, number] | null;
  mode: "instant" | "trace";
  stepIndex?: number;
  totalSteps?: number;
  playing?: boolean;
  nextStep?: { i: number; j: number } | null;
  progress?: number;
};

export default function Visualizer({
  data,
  activeIndices,
  mode,
  stepIndex = 0,
  totalSteps = 0,
  playing = false,
  nextStep,
  progress = 0,
}: Props) {
  const max = Math.max(...data, 1);
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="visualizer-shell">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-soft/30 to-transparent" />

      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Visualizer
          </p>
          <p className="mt-1 text-sm text-text/80">
            {mode === "instant"
              ? "Instant result"
              : playing
                ? "Playing trace"
                : "Paused trace"}
          </p>
        </div>

        {mode === "trace" && (
          <div className="min-w-56">
            <div className="mb-2 flex items-center justify-between text-xs text-muted">
              <span>
                Step {Math.min(stepIndex, totalSteps)} / {totalSteps}
              </span>
              {nextStep ? (
                <span>
                  {nextStep.i} ↔ {nextStep.j}
                </span>
              ) : (
                <span>Done</span>
              )}
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-bg/60">
              <div
                className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)]"
                style={{
                  clipPath: `inset(0 ${100 - clampedProgress}% 0 0)`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="visualizer-stage">
        {data.length === 0 ? (
          <div className="visualizer-empty">No data yet</div>
        ) : (
          <div className="flex h-full items-end gap-1">
            {data.map((value, index) => {
              const active = activeIndices?.includes(index) ?? false;
              const first = activeIndices?.[0] === index;
              const second = activeIndices?.[1] === index;

              const barClass = active
                ? first
                  ? "bar-active-a"
                  : "bar-active-b"
                : "bar-default";

              const heightPct = ((value + 1) / (max + 1)) * 100;

              return (
                <div key={index} className="flex h-full flex-1 flex-col items-center">
                  <div className="flex h-full w-full items-end justify-center">
                    <motion.div
                      layout
                      initial={false}
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      className={`relative w-full rounded-t-2xl ${barClass} ${
                        active
                          ? first
                            ? "shadow-lg shadow-accent/15"
                            : "shadow-lg shadow-danger/20"
                          : "shadow-sm shadow-black/30"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute inset-0 rounded-t-2xl bg-black/10" />
                    </motion.div>
                  </div>

                  <div className="mt-2 flex h-3 items-center justify-center">
                    {(first || second) && <div className="visualizer-dot" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}