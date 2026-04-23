
type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-text">{value}</div>
    </div>
  );
}