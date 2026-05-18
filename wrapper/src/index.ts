import * as wasm from "../pkg/rust_unsorter.js";
import { unsort as wasmUnsort, Algorithm as WasmAlgorithm } from "../pkg/rust_unsorter.js";
import type {
  AlgorithmInfo,
  UnsortOptions,
  UnsortTrace,
  RawTraceResult,
  UnsortStep,
} from "./types.js";
export { WasmAlgorithm as Algorithm };
export type { AlgorithmInfo, UnsortOptions, UnsortStep, UnsortTrace };


const unsortImpl = wasmUnsort as (
  input: Int32Array,
  algorithm?: WasmAlgorithm,
  seed?: number
) => Int32Array;

const wasmAny = wasm as any;
const unsortStepsImpl = (wasmAny.unsortSteps ?? wasmAny.unsort_steps) as (
  input: Int32Array,
  algorithm?: WasmAlgorithm,
  seed?: number
) => RawTraceResult;

/**
 * Metadata for every public algorithm.
 *
 * Useful for building selectors, help panels, tooltips, and documentation without
 * duplicating algorithm copy in application code.
 */
export const ALGORITHM_INFO: readonly AlgorithmInfo[] = [
  {
    value: WasmAlgorithm.FisherYates,
    label: "Fisher-Yates",
    description:
      "Uniform random shuffle. It walks backward through the array and swaps each item with a random earlier position, including itself.",
    seeded: true,
  },
  {
    value: WasmAlgorithm.Sattolo,
    label: "Sattolo cycle",
    description:
      "A Fisher-Yates variant that creates one big cycle, so every item moves when the array has at least two values.",
    seeded: true,
  },
  {
    value: WasmAlgorithm.Derangement,
    label: "Derangement",
    description:
      "Keeps shuffling until no value remains in its original position. Good when unsorted should really mean moved.",
    seeded: true,
  },
  {
    value: WasmAlgorithm.Riffle,
    label: "Riffle",
    description:
      "Cuts the array into two packets and interleaves them with weighted random choices, like a loose hand shuffle.",
    seeded: true,
  },
  {
    value: WasmAlgorithm.InsideOut,
    label: "Inside-out",
    description:
      "Builds the shuffled order from left to right, inserting each incoming item into a random position.",
    seeded: true,
  },
  {
    value: WasmAlgorithm.Reverse,
    label: "Reverse",
    description:
      "Deterministic outside-in swaps that reverse the full array. Simple, fast, and visually obvious.",
    seeded: false,
  },
  {
    value: WasmAlgorithm.FaroOut,
    label: "Faro out",
    description:
      "Splits the array and perfectly interleaves both halves, keeping the first item in front.",
    seeded: false,
  },
  {
    value: WasmAlgorithm.FaroIn,
    label: "Faro in",
    description:
      "Splits the array and perfectly interleaves both halves, starting with the second half.",
    seeded: false,
  },
  {
    value: WasmAlgorithm.BitReversal,
    label: "Bit reversal",
    description:
      "Moves items according to bit-reversed index order, a structured permutation used in FFT-style algorithms.",
    seeded: false,
  },
  {
    value: WasmAlgorithm.Recursive,
    label: "Recursive halves",
    description:
      "Recursively unsorts each half, then swaps one random item across the split to disturb the boundary.",
    seeded: false,
  },
  {
    value: WasmAlgorithm.Mask,
    label: "LCG mask",
    description:
      "Uses a small linear congruential generator seeded from a random mask to produce a custom swap pattern.",
    seeded: false,
  },
] as const;

/**
 * Returns a new `Int32Array` with the input values rearranged by the selected algorithm.
 *
 * Plain `number[]` inputs are converted to `Int32Array` automatically. If no
 * algorithm is provided, Fisher-Yates is used.
 */
export function unsort(
  input: number[] | Int32Array,
  options: UnsortOptions = {}
): Int32Array {
  const arr = input instanceof Int32Array ? input : Int32Array.from(input);

  return unsortImpl(arr, options.algorithm ?? WasmAlgorithm.FisherYates, options.seed);
}

/**
 * Returns the final unsorted result plus a replayable list of swap steps.
 *
 * Use this for visualizers and teaching UIs where each algorithm action should
 * be animated rather than applied all at once.
 */
export function unsortSteps(
  input: number[] | Int32Array,
  options: UnsortOptions = {}
): UnsortTrace {
  const arr = input instanceof Int32Array ? input : Int32Array.from(input);
  const raw = unsortStepsImpl(arr, options.algorithm ?? WasmAlgorithm.FisherYates, options.seed);

  return {
    result: Int32Array.from(raw.result),
    steps: raw.steps,
  };
}
