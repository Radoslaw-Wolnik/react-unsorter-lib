import { useEffect, useState } from "react";
import { unsort, Algorithm } from "react-unsorter-lib";
import Visualizer from "./components/Visualizer";

function randomArray(size: number) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100)
  );
}

export default function App() {
  const [data, setData] = useState<number[]>([]);
  const [algo, setAlgo] = useState<Algorithm>(Algorithm.Random);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  useEffect(() => {
    setData(randomArray(50).sort((a, b) => a - b));
  }, []);

  function handleUnsort() {
    const result = unsort(data, { algorithm: algo, seed });
    setData(Array.from(result));
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-zinc-800 rounded-2xl shadow-xl p-6 space-y-6">
        
        <h1 className="text-2xl font-bold text-center">
          Unsort Visualizer
        </h1>

        <Visualizer data={data} />

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-center">

          {/* Algorithm */}
          <select
            className="bg-zinc-700 px-3 py-2 rounded-lg"
            value={algo}
            onChange={(e) => setAlgo(Number(e.target.value) as Algorithm)}
          >
            <option value={Algorithm.Random}>Random</option>
            <option value={Algorithm.LastFirst}>LastFirst</option>
            <option value={Algorithm.Recursive}>Recursive</option>
            <option value={Algorithm.Mask}>Mask</option>
          </select>

          {/* Seed */}
          <input
            className="w-44 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-400"
            type="text"
            inputMode="numeric"
            placeholder="Seed (optional)"
            value={seed ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              setSeed(val === "" ? undefined : Number(val));
            }}
          />

          {/* Buttons */}
          <button
            onClick={handleUnsort}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
          >
            Unsort
          </button>

          <button
            onClick={() =>
              setData(randomArray(50).sort((a, b) => a - b))
            }
            className="bg-zinc-600 hover:bg-zinc-500 px-4 py-2 rounded-lg transition"
          >
            New Array
          </button>
        </div>
      </div>
    </div>
  );
}