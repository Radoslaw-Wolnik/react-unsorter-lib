import * as wasm from "../pkg/rust_unsorter.js";
import { unsort as wasmUnsort, Algorithm as WasmAlgorithm } from "../pkg/rust_unsorter.js";
import type { UnsortOptions, UnsortTrace, RawTraceResult, UnsortStep } from "./types.js";
export { WasmAlgorithm as Algorithm };
export type { UnsortOptions, UnsortStep, UnsortTrace };


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

export function unsort(
  input: number[] | Int32Array,
  options: UnsortOptions = {}
): Int32Array {
  const arr = input instanceof Int32Array ? input : Int32Array.from(input);

  return unsortImpl(arr, options.algorithm ?? WasmAlgorithm.Random, options.seed);
}

export function unsortSteps(
  input: number[] | Int32Array,
  options: UnsortOptions = {}
): UnsortTrace {
  const arr = input instanceof Int32Array ? input : Int32Array.from(input);
  const raw = unsortStepsImpl(arr, options.algorithm ?? WasmAlgorithm.Random, options.seed);

  return {
    result: Int32Array.from(raw.result),
    steps: raw.steps,
  };
}