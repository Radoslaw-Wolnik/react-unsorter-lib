import type { Algorithm as WasmAlgorithm } from "../pkg/rust_unsorter.js";

export { WasmAlgorithm as Algorithm };

/**
 * Describes one unsorting algorithm exposed by the WASM package.
 */
export interface AlgorithmInfo {
  /**
   * The enum value passed to `unsort()` or `unsortSteps()`.
   */
  value: WasmAlgorithm;
  /**
   * Short display name for UI controls.
   */
  label: string;
  /**
   * Human-readable explanation of what the algorithm does.
   */
  description: string;
  /**
   * Whether the algorithm uses randomness and can be reproduced with `seed`.
   */
  seeded: boolean;
}

/**
 * Options shared by `unsort()` and `unsortSteps()`.
 */
export interface UnsortOptions {
  /**
   * Algorithm to use. Defaults to `Algorithm.FisherYates`.
   */
  algorithm?: WasmAlgorithm;
  /**
   * Optional seed for algorithms that use randomness.
   */
  seed?: number;
}

/**
 * One replayable trace step. The demo currently animates all algorithms as swaps.
 */
export interface UnsortStep {
  kind: "swap";
  i: number;
  j: number;
}

/**
 * Final array plus the swap trace needed for step-by-step playback.
 */
export interface UnsortTrace {
  result: Int32Array;
  steps: UnsortStep[];
}

// Internal raw shape from WASM
export type RawTraceResult = {
  result: number[];
  steps: UnsortStep[];
};
