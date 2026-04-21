import { motion } from "framer-motion";

export default function Visualizer({ data }: { data: number[] }) {
  return (
    <div className="flex items-end h-64 gap-1">
      {data.map((value, i) => (
        <motion.div
          key={i}
          layout
          className="bg-blue-400 w-full rounded"
          style={{ height: value * 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      ))}
    </div>
  );
}