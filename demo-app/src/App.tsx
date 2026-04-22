import { useEffect, useState } from "react";
import {
  Algorithm,
  unsort,
  unsortSteps,
  type UnsortTrace,
} from "react-unsorter-lib";
import { RotateCcw } from "lucide-react";
import Visualizer from "./components/Visualizer";

type Mode = "instant" | "trace";

const ALGORITHMS = [
  { value: Algorithm.Random, label: "Random" },
  { value: Algorithm.LastFirst, label: "LastFirst" },
  { value: Algorithm.Recursive, label: "Recursive" },
  { value: Algorithm.Mask, label: "Mask" },
] as const;

function makeSortedArray(size = 48) {
  return Array.from({ length: size }, (_, i) => i + 1);
}

function parseSeed(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function parseArraySize(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 48;
  return Math.max(1, Math.min(200, Math.trunc(n)));
}

function swapCopy(arr: number[], i: number, j: number) {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel/70 px-4 py-3 shadow-sm shadow-black/20">
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-text">{value}</div>
    </div>
  );
}

const cardBase =
  "rounded-3xl border border-border bg-surface/75 shadow-2xl shadow-black/20 backdrop-blur";
const subtleButton =
  "rounded-xl border border-border bg-panel-strong/90 px-4 py-2 text-sm font-medium text-text transition hover:bg-panel-strong disabled:cursor-not-allowed disabled:opacity-50";
const activeButton =
  "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-bg transition hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50";

export default function App() {
  const [mode, setMode] = useState<Mode>("instant");
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.Random);
  const [seedText, setSeedText] = useState("");
  const [arraySizeText, setArraySizeText] = useState("48");

  const arraySize = parseArraySize(arraySizeText);

  const [data, setData] = useState<number[]>(() => makeSortedArray(arraySize));
  const [trace, setTrace] = useState<UnsortTrace | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(55);
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(
    null
  );
  const [startingData, setStartingData] = useState<number[] | null>(null);

  const seed = parseSeed(seedText);
  const playbackDelayMs = Math.max(50, 1050 - playbackSpeed * 10);

  useEffect(() => {
    if (!playing || !trace) return;

    if (stepIndex >= trace.steps.length) {
      setData(Array.from(trace.result));
      setPlaying(false);
      setActiveIndices(null);
      return;
    }

    const id = window.setTimeout(() => {
      const step = trace.steps[stepIndex];
      setData((prev) => swapCopy(prev, step.i, step.j));
      setActiveIndices([step.i, step.j]);
      setStepIndex((s) => s + 1);
    }, playbackDelayMs);

    return () => window.clearTimeout(id);
  }, [playing, trace, stepIndex, playbackDelayMs]);

  function clearTraceState() {
    setTrace(null);
    setStepIndex(0);
    setPlaying(false);
    setActiveIndices(null);
    setStartingData(null);
  }

  function regenerateArray(nextSize: number) {
    setData(makeSortedArray(nextSize));
    clearTraceState();
  }

  function handleArraySizeChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setArraySizeText(digits);

    if (digits === "") return;

    regenerateArray(parseArraySize(digits));
  }

  function sortToFreshArray() {
    regenerateArray(arraySize);
  }

  function replayTrace() {
    if (!startingData) return;

    setData([...startingData]);
    setStepIndex(0);
    setActiveIndices(null);
    setPlaying(true);
  }

  function runUnsort() {
    const options = { algorithm, seed };

    if (mode === "instant") {
      clearTraceState();
      const result = unsort(data, options);
      setData(Array.from(result));
      return;
    }

    const source = [...data];
    const result = unsortSteps(source, options);

    setStartingData(source);
    setTrace(result);
    setData(source);
    setStepIndex(0);
    setActiveIndices(null);
    setPlaying(true);
  }

  function stepOnce() {
    if (!trace || stepIndex >= trace.steps.length) return;

    setPlaying(false);

    const step = trace.steps[stepIndex];
    setData((prev) => swapCopy(prev, step.i, step.j));
    setActiveIndices([step.i, step.j]);
    setStepIndex((s) => s + 1);
  }

  const totalSteps = trace?.steps.length ?? 0;
  const progress =
    totalSteps === 0 ? 0 : Math.min(100, (stepIndex / totalSteps) * 100);

  const nextStep =
    trace && stepIndex < trace.steps.length ? trace.steps[stepIndex] : null;

  return (
    <div className="min-h-screen bg-transparent text-text">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className={cardBase}>
          <header className="flex flex-col gap-4 border-b border-border p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-primary-soft/80">
                Rust + WASM + React
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Unsort Visualizer
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                A playful learning project that turns a Rust WebAssembly package
                into a small React demo. <br></br> Switch between instant unsorting and a
                step-by-step trace mode that shows each swap as it happens.
              </p>
            </div>
          </header>

          <div className="mt-6 grid gap-6 p-6 pt-0 xl:grid-cols-[minmax(0,1.7fr)_360px]">
            <div className="space-y-6">
              <Visualizer
                data={data}
                activeIndices={activeIndices}
                mode={mode}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
                playing={playing}
                nextStep={nextStep}
                progress={progress}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Mode"
                  value={mode === "instant" ? "Instant" : "Step-by-step"}
                />
                <Stat
                  label="Current algorithm"
                  value={
                    ALGORITHMS.find((a) => a.value === algorithm)?.label ??
                    "Random"
                  }
                />
                <Stat
                  label="Current step"
                  value={
                    mode === "trace"
                      ? `${Math.min(stepIndex, totalSteps)} / ${totalSteps}`
                      : "—"
                  }
                />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border bg-panel/70 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-text/80">
                  Controls
                </h2>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted">
                      Mode
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMode("instant")}
                        className={
                          mode === "instant"
                            ? "rounded-full bg-primary px-4 py-2 text-sm font-medium text-bg transition hover:bg-primary-soft"
                            : "rounded-full border border-border bg-panel-strong/90 px-4 py-2 text-sm font-medium text-text transition hover:bg-panel-strong"
                        }
                      >
                        Instant
                      </button>
                      <button
                        onClick={() => setMode("trace")}
                        className={
                          mode === "trace"
                            ? "rounded-full bg-primary px-4 py-2 text-sm font-medium text-bg transition hover:bg-primary-soft"
                            : "rounded-full border border-border bg-panel-strong/90 px-4 py-2 text-sm font-medium text-text transition hover:bg-panel-strong"
                        }
                      >
                        Step-by-step
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted">
                      Algorithm
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALGORITHMS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setAlgorithm(item.value)}
                          className={
                            algorithm === item.value
                              ? "rounded-xl bg-primary px-3 py-2 text-sm font-medium text-bg transition hover:bg-primary-soft"
                              : "rounded-xl border border-border bg-panel-strong/90 px-3 py-2 text-sm font-medium text-text transition hover:bg-panel-strong"
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">
                      Array size
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="48"
                      value={arraySizeText}
                      onChange={(e) => handleArraySizeChange(e.target.value)}
                      className="rounded-xl border border-border bg-bg/70 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">
                      Seed
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="optional"
                      value={seedText}
                      onChange={(e) => setSeedText(e.target.value)}
                      className="rounded-xl border border-border bg-bg/70 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={runUnsort}
                      className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-soft"
                    >
                      {mode === "instant" ? "Unsort" : "Generate trace"}
                    </button>

                    <button
                      onClick={sortToFreshArray}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-strong/90 px-4 py-2.5 text-sm font-medium text-text transition hover:bg-panel-strong"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Sort
                    </button>
                  </div>
                </div>
              </div>

              {mode === "trace" && (
                <div className="rounded-3xl border border-border bg-panel/70 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-text/80">
                    Trace controls
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      disabled={totalSteps === 0}
                      className={activeButton}
                    >
                      {playing ? "Pause" : "Play"}
                    </button>

                    <button
                      onClick={stepOnce}
                      disabled={totalSteps === 0}
                      className={subtleButton}
                    >
                      Step once
                    </button>

                    <button
                      onClick={replayTrace}
                      disabled={!startingData}
                      className={subtleButton}
                    >
                      Replay trace
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                      <span>Playback speed</span>
                      <span className="tabular-nums">{playbackSpeed}/100</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      step={1}
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}