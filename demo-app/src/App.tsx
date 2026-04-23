import { useEffect, useState } from "react";
import { Algorithm, unsort, unsortSteps, type UnsortTrace } from "react-unsorter-lib";
import { RotateCcw } from "lucide-react";
import Visualizer from "./components/Visualizer";
import { Button, Card, RangeField, StatCard, TextField } from "./components/ui";

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

export default function App() {
  const [mode, setMode] = useState<"instant" | "trace">("instant");
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.Random);
  const [seedText, setSeedText] = useState("");
  const [arraySizeText, setArraySizeText] = useState("48");

  const arraySize = parseArraySize(arraySizeText);

  const [data, setData] = useState<number[]>(() => makeSortedArray(arraySize));
  const [trace, setTrace] = useState<UnsortTrace | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(55);
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(null);
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
  const progress = totalSteps === 0 ? 0 : Math.min(100, (stepIndex / totalSteps) * 100);

  const nextStep =
    trace && stepIndex < trace.steps.length ? trace.steps[stepIndex] : null;

  return (
    <div className="min-h-screen bg-transparent text-text">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="app-shell">
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
                into a small React demo. Switch between instant unsorting and a
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
                <StatCard
                  label="Mode"
                  value={mode === "instant" ? "Instant" : "Step-by-step"}
                />
                <StatCard
                  label="Current algorithm"
                  value={
                    ALGORITHMS.find((a) => a.value === algorithm)?.label ?? "Random"
                  }
                />
                <StatCard
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
              <Card className="p-5">
                <h2 className="section-kicker">Controls</h2>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="field-label mb-2">Mode</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        shape="pill"
                        active={mode === "instant"}
                        onClick={() => setMode("instant")}
                      >
                        Instant
                      </Button>
                      <Button
                        shape="pill"
                        active={mode === "trace"}
                        onClick={() => setMode("trace")}
                      >
                        Step-by-step
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="field-label mb-2">Algorithm</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALGORITHMS.map((item) => (
                        <Button
                          key={item.label}
                          active={algorithm === item.value}
                          onClick={() => setAlgorithm(item.value)}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <TextField
                    label="Array size"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="48"
                    value={arraySizeText}
                    onChange={(e) => handleArraySizeChange(e.target.value)}
                  />

                  <TextField
                    label="Seed"
                    inputMode="numeric"
                    placeholder="optional"
                    value={seedText}
                    onChange={(e) => setSeedText(e.target.value)}
                  />

                  <div className="flex flex-wrap gap-3">
                    <Button variant="accent" onClick={runUnsort}>
                      {mode === "instant" ? "Unsort" : "Generate trace"}
                    </Button>

                    <Button onClick={sortToFreshArray}>
                      <RotateCcw className="h-4 w-4" />
                      Sort
                    </Button>
                  </div>
                </div>
              </Card>

              {mode === "trace" && (
                <Card className="p-5">
                  <h2 className="section-kicker">Trace controls</h2>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button
                      variant="accent"
                      onClick={() => setPlaying((p) => !p)}
                      disabled={totalSteps === 0}
                    >
                      {playing ? "Pause" : "Play"}
                    </Button>

                    <Button onClick={stepOnce} disabled={totalSteps === 0}>
                      Step once
                    </Button>

                    <Button onClick={replayTrace} disabled={!startingData}>
                      Replay trace
                    </Button>
                  </div>

                  <div className="mt-5">
                    <RangeField
                      label="Playback speed"
                      valueLabel={`${playbackSpeed}/100`}
                      min={1}
                      max={100}
                      step={1}
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    />
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}