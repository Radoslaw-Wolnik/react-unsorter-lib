type Props = { label: string; value: string | number };

export function StatCard({ label, value }: Props) {
  return (
    <div className="stat-card">
      <div className="kicker mb-1">{label}</div>
      <div className="text-sm font-medium text-[--color-text]">{value}</div>
    </div>
  );
}
