import { Algorithm } from "react-unsorter-lib";
import { RotateCcw } from "lucide-react";

import { useUnsortPlayer } from "@/hooks/useUnsortPlayer";
import Visualizer from "./components/Visualizer";
import { Button, Card, RangeField, StatCard, TextField } from "./components/ui";

const ALGORITHMS = [
  { value: Algorithm.Random,    label: "Random"    },
  { value: Algorithm.LastFirst, label: "LastFirst" },
  { value: Algorithm.Recursive, label: "Recursive" },
  { value: Algorithm.Mask,      label: "Mask"      },
] as const;

export default function App() {
  const p = useUnsortPlayer();

  return (
    /* Full viewport — no scrolling on the outer page */
    <div className="flex h-screen flex-col overflow-hidden bg-transparent text-[--color-text]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 py-4 md:px-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-surface] shadow-xl shadow-black/30">

          {/* ── Header — fixed height ── */}
          <header className="shrink-0 border-b border-[--color-border] px-6 py-5">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="kicker mb-1.5 text-[--color-primary-text]/60">Rust · WASM · React</p>
                <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[--color-text]">
                  Unsort Visualizer
                </h1>
              </div>
              <p className="hidden max-w-xs text-[13px] leading-5 text-[--color-muted] md:block">
                Instant mode unsorts immediately; step-by-step trace mode animates each swap.
              </p>
            </div>
          </header>

          {/* ── Main layout — fills remaining height ── */}
          <div className="grid min-h-0 flex-1 gap-4 p-4 xl:grid-cols-[1fr_300px]">

            {/* Left column — visualizer + stats */}
            <div className="flex min-h-0 flex-col gap-3">
              {/* Visualizer fills available space */}
              <div className="min-h-0 flex-1">
                <Visualizer
                  data={p.data}
                  activeIndices={p.activeIndices}
                  mode={p.mode}
                  stepIndex={p.stepIndex}
                  totalSteps={p.totalSteps}
                  playing={p.playing}
                  nextStep={p.nextStep}
                  progress={p.progress}
                />
              </div>

              {/* Stat row — fixed height at bottom of left col */}
              <div className="grid shrink-0 grid-cols-3 gap-3">
                <StatCard
                  label="Mode"
                  value={p.mode === "instant" ? "Instant" : "Step-by-step"}
                />
                <StatCard
                  label="Algorithm"
                  value={ALGORITHMS.find((a) => a.value === p.algorithm)?.label ?? "Random"}
                />
                <StatCard
                  label="Step"
                  value={
                    p.mode === "trace"
                      ? `${Math.min(p.stepIndex, p.totalSteps)} / ${p.totalSteps}`
                      : "—"
                  }
                />
              </div>
            </div>

            {/* Right sidebar — scrollable internally */}
            <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto">

              {/* Controls card */}
              <Card className="shrink-0 p-4">
                <p className="kicker mb-3">Controls</p>

                {/* Mode toggle */}
                <div className="mb-3">
                  <p className="kicker mb-1.5 text-[--color-muted]/60">Mode</p>
                  <div className="flex gap-2">
                    <Button shape="pill" active={p.mode === "instant"} onClick={() => p.setMode("instant")}>
                      Instant
                    </Button>
                    <Button shape="pill" active={p.mode === "trace"} onClick={() => p.setMode("trace")}>
                      Step-by-step
                    </Button>
                  </div>
                </div>

                {/* Algorithm grid */}
                <div className="mb-3">
                  <p className="kicker mb-1.5 text-[--color-muted]/60">Algorithm</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ALGORITHMS.map((item) => (
                      <Button
                        key={item.label}
                        active={p.algorithm === item.value}
                        onClick={() => p.setAlgorithm(item.value)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <TextField
                    label="Array size"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="48"
                    value={p.arraySizeText}
                    onChange={(e) => p.handleArraySizeChange(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <TextField
                    label="Seed"
                    inputMode="numeric"
                    placeholder="optional"
                    value={p.seedText}
                    onChange={(e) => p.setSeedText(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="accent" onClick={p.runUnsort}>
                    {p.mode === "instant" ? "Unsort" : "Generate trace"}
                  </Button>
                  <Button onClick={p.sortToFreshArray}>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </Card>

              {/* Trace controls card */}
              {p.mode === "trace" && (
                <Card className="shrink-0 p-4">
                  <p className="kicker mb-3">Trace controls</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                      variant="accent"
                      onClick={() => p.setPlaying(!p.playing)}
                      disabled={p.totalSteps === 0}
                    >
                      {p.playing ? "Pause" : "Play"}
                    </Button>
                    <Button onClick={p.stepOnce} disabled={p.totalSteps === 0}>
                      Step once
                    </Button>
                    <Button onClick={p.replayTrace} disabled={p.totalSteps === 0}>
                      Replay
                    </Button>
                  </div>

                  <RangeField
                    label="Playback speed"
                    valueLabel={`${p.playbackSpeed}/100`}
                    min={1}
                    max={100}
                    step={1}
                    value={p.playbackSpeed}
                    onChange={(e) => p.setPlaybackSpeed(Number(e.target.value))}
                  />
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

