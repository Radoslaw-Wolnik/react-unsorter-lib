# React Unsorter Lib

A small learning project that combines **Rust**, **WebAssembly**, **TypeScript**, and **React** to build a package that can "unsort" arrays in a few different ways.

This project is intentionally a little silly — it exists mostly as a hands-on way to learn how to:

* write reusable Rust code
* compile Rust to WebAssembly
* expose a clean JavaScript/TypeScript API from a Rust library
* wrap low-level WASM exports in a nicer React-friendly package
* build a real Vite + React demo app on top of the package
* add step-by-step visual tracing for algorithm playback

The result is a package that is easy to consume from React, while the heavy lifting happens in Rust.

### Snapshot of demo app
![alt text](snapshot.png "The screenshot with the app demo")

## What it does

`react-unsorter-lib` exposes two main functions for working with number arrays:

* `unsort()` — returns a new array with the values rearranged using one of several algorithms
* `unsortSteps()` — returns the final result plus a list of swap steps that can be replayed in a UI

Available algorithms:

* `Random` — shuffles the array randomly
* `LastFirst` — swaps items from the outside in
* `Recursive` — recursively rearranges halves of the array
* `Mask` — uses a custom pseudo-random swap pattern

You can also pass an optional seed for the random algorithm to make results reproducible.

## Project structure

```text
react-unsorter-lib/
├─ rust-unsorter/   # Rust crate compiled to WebAssembly
├─ wrapper/         # TypeScript package that wraps the WASM exports
└─ demo-app/        # React + Vite demo app
```

### `rust-unsorter`

The Rust crate contains the actual algorithms and the WASM bindings. It exports the core `unsort` function, the `unsortSteps` trace function, and the `Algorithm` enum.

### `wrapper`

This is the ergonomic TypeScript package that application code imports. It hides the WASM-specific details and provides a nicer API for React and TypeScript consumers.

### `demo-app`

A small Vite + React app that shows the library in action with a polished visualizer, mode switching, playback controls, and bar highlighting.

## Why the wrapper exists

The Rust/WASM layer is intentionally kept low-level. The wrapper makes the package nicer to use by:

* converting plain arrays to `Int32Array` automatically
* providing TypeScript types for the public API
* exposing a simple import path for app code
* hiding WASM-specific details from the demo app
* normalizing the trace result so the UI can use it easily

That means React code can call the library like a normal package instead of dealing with the lower-level WASM export directly.

## Prerequisites

Make sure you have the following installed:

* [Rust](https://www.rust-lang.org/tools/install)
* [Node.js](https://nodejs.org/) and npm
* `wasm-pack`

If you do not have `wasm-pack` yet, install it with:

```bash
cargo install wasm-pack
```

## Build the project

### 1. Build the Rust/WASM package

From the `rust-unsorter` directory:

```bash
cd rust-unsorter
wasm-pack build --target bundler --out-dir ../wrapper/pkg
```

This generates the WASM package inside `wrapper/pkg`, which is what the TypeScript wrapper imports.

### 2. Build the wrapper package

From the `wrapper` directory:

```bash
cd wrapper
npm install
npm run build
```

This compiles the TypeScript wrapper into `dist/`.

### 3. Run the demo app

From the `demo-app` directory:

```bash
cd demo-app
npm install
npm run dev
```

The demo app uses Vite, so it also needs the WASM plugin configured.

## Vite setup

The demo app uses `vite-plugin-wasm` so Vite can load the generated WebAssembly package correctly.

The important part of the Vite config is:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [react(), wasm()],
  optimizeDeps: {
    exclude: ['react-unsorter-lib']
  }
})
```

The `optimizeDeps.exclude` entry helps Vite avoid pre-bundling the local WASM package in a way that can break loading.

## Usage

### Instant mode

```ts
import { unsort, Algorithm } from 'react-unsorter-lib';

const input = [1, 2, 3, 4, 5];

const output = unsort(input, {
  algorithm: Algorithm.Random,
  seed: 123,
});

console.log(output); // Int32Array
```

### Trace mode

```ts
import { unsortSteps, Algorithm } from 'react-unsorter-lib';

const trace = unsortSteps([1, 2, 3, 4, 5], {
  algorithm: Algorithm.LastFirst,
});

console.log(trace.result); // Int32Array
console.log(trace.steps);  // swap steps for animation
```

### API

```ts
unsort(
  input: number[] | Int32Array,
  options?: {
    algorithm?: Algorithm;
    seed?: number;
  }
): Int32Array
```

```ts
unsortSteps(
  input: number[] | Int32Array,
  options?: {
    algorithm?: Algorithm;
    seed?: number;
  }
): {
  result: Int32Array;
  steps: Array<{ kind: 'swap'; i: number; j: number }>;
}
```

### Notes

* `input` can be either a regular `number[]` or an `Int32Array`
* the result of `unsort()` is returned as an `Int32Array`
* `unsortSteps()` returns both the final result and a list of swap operations
* `seed` is optional and only matters for the seeded random path

## Demo app

The demo app shows the library in a more polished UI:

* generate a sorted array
* choose an algorithm
* optionally set a seed
* switch between **Instant** and **Step-by-step** modes
* click **Unsort** for a fast result
* click **Generate trace** to replay the swaps visually
* use playback controls to pause, step once, reset, or change speed
* see the changed bars highlighted during playback

It is not meant to be a serious sorting visualizer. It is a learning demo that makes the WASM package easier to understand and test.

## Development notes

This project is a learning exercise, so the implementation focuses on clarity and experimentation rather than perfect production behavior.

A few things worth knowing:

* the Rust crate exports multiple algorithms through a single WASM interface
* the wrapper keeps the consumer API small and pleasant
* the demo app is there to prove the package works in a real React setup
* the project structure is split intentionally so each layer can be learned independently
* step tracing is implemented as a lightweight observer layer so the non-traced path stays clean

## License

MIT

---

Built as a learning project for experimenting with Rust, WebAssembly, and React package design.
