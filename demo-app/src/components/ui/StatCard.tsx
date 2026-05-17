type Props = { label: string; value: string | number };

export function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-xl border border-[--color-border-soft] bg-[--color-panel] px-4 py-3">
      <div className="kicker mb-1.5">{label}</div>
      {/* font-mono: stat values are data, monospace aids scannability */}
      <div className="font-mono text-sm font-medium text-[--color-text]">{value}</div>
    </div>
  );
}
