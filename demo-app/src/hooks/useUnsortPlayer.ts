import { useEffect, useState } from "react";
import {
  Algorithm,
  unsort,
  unsortSteps,
  type UnsortTrace,
} from "react-unsorter-lib";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

function parseSeed(raw: string): number | undefined {
  const n = Number(raw.trim());
  return raw.trim() && Number.isFinite(n) ? n : undefined;
}

function parseArraySize(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 48;
  return Math.max(1, Math.min(200, Math.trunc(n)));
}

function swapCopy(arr: number[], i: number, j: number): number[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

// ─── types ───────────────────────────────────────────────────────────────────

export type Mode = "instant" | "trace";

export interface UnsortPlayerState {
  // array display
  data: number[];
  activeIndices: [number, number] | null;

  // controls
  mode: Mode;
  setMode: (m: Mode) => void;
  algorithm: Algorithm;
  setAlgorithm: (a: Algorithm) => void;
  seedText: string;
  setSeedText: (s: string) => void;
  arraySizeText: string;
  handleArraySizeChange: (raw: string) => void;
  arraySize: number;

  // trace playback
  playing: boolean;
  setPlaying: (p: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (s: number) => void;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  nextStep: { i: number; j: number } | null;

  // actions
  runUnsort: () => void;
  sortToFreshArray: () => void;
  stepOnce: () => void;
  replayTrace: () => void;
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useUnsortPlayer(): UnsortPlayerState {
  const [mode, setMode] = useState<Mode>("instant");
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.Random);
  const [seedText, setSeedText] = useState("");
  const [arraySizeText, setArraySizeText] = useState("48");

  const arraySize = parseArraySize(arraySizeText);

  const [data, setData] = useState<number[]>(() => makeSortedArray(48));
  const [trace, setTrace] = useState<UnsortTrace | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(55);
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(null);
  const [startingData, setStartingData] = useState<number[] | null>(null);

  const playbackDelayMs = Math.max(50, 1050 - playbackSpeed * 10);

  // ── playback loop ──────────────────────────────────────────────────────────
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

  // ── internal helpers ───────────────────────────────────────────────────────
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

  // ── exported actions ───────────────────────────────────────────────────────
  function handleArraySizeChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setArraySizeText(digits);
    if (digits) regenerateArray(parseArraySize(digits));
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
    const options = { algorithm, seed: parseSeed(seedText) };

    if (mode === "instant") {
      clearTraceState();
      setData(Array.from(unsort(data, options)));
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

  return {
    data,
    activeIndices,
    mode,
    setMode,
    algorithm,
    setAlgorithm,
    seedText,
    setSeedText,
    arraySizeText,
    handleArraySizeChange,
    arraySize,
    playing,
    setPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    stepIndex,
    totalSteps,
    progress,
    nextStep,
    runUnsort,
    sortToFreshArray,
    stepOnce,
    replayTrace,
  };
}
