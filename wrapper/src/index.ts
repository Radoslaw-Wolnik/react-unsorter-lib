import { unsort as wasmUnsort, Algorithm as WasmAlgorithm } from "../pkg/rust_unsorter.js";

export type UnsortOptions = {
  algorithm?: WasmAlgorithm;
  seed?: number;
};

export { WasmAlgorithm as Algorithm };

export function unsort(
  input: number[] | Int32Array,
  options: UnsortOptions = {}
): Int32Array {
  const arr = input instanceof Int32Array ? input : Int32Array.from(input);

  return wasmUnsort(
    arr,
    options.algorithm ?? WasmAlgorithm.Random,
    options.seed
  );
}