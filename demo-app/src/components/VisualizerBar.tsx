import { motion } from "framer-motion";

type Props = {
  heightPct: number;
  isFirst:   boolean;
  isSecond:  boolean;
};

const spring = { type: "spring", stiffness: 280, damping: 30 } as const;

export function VisualizerBar({ heightPct, isFirst, isSecond }: Props) {
  const active = isFirst || isSecond;
  const barClass = isFirst ? "bar-swap-a" : isSecond ? "bar-swap-b" : "bar-default";

  return (
    <div className="flex h-full flex-1 flex-col items-center">
      <div className="flex h-full w-full items-end justify-center">
        <motion.div
          layout
          initial={false}
          transition={spring}
          className={`relative w-full rounded-t-sm ${barClass}`}
          style={{ height: `${heightPct}%` }}
        >
          {/* subtle inner highlight */}
          <div className="absolute inset-x-0 top-0 h-px rounded-t-sm bg-white/20" />
        </motion.div>
      </div>
      {/* dot marker under active bars */}
      <div className="mt-1.5 flex h-2 items-center justify-center">
        {active && (
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: isFirst
                ? "var(--color-swap-a)"
                : "var(--color-swap-b)",
              boxShadow: isFirst
                ? "0 0 6px var(--color-swap-a)"
                : "0 0 6px var(--color-swap-b)",
            }}
          />
        )}
      </div>
    </div>
  );
}
