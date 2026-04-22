import type { Algorithm as WasmAlgorithm } from "../pkg/rust_unsorter.js";

export { WasmAlgorithm as Algorithm };

export interface UnsortOptions {
  algorithm?: WasmAlgorithm;
  seed?: number;
}

export interface UnsortStep {
  kind: "swap";
  i: number;
  j: number;
}

export interface UnsortTrace {
  result: Int32Array;
  steps: UnsortStep[];
}

// Internal raw shape from WASM
export type RawTraceResult = {
  result: number[];
  steps: UnsortStep[];
};