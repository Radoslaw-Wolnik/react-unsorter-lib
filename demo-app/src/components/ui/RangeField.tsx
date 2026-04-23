import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type RangeFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  valueLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
};

export function RangeField({
  label,
  valueLabel,
  leftLabel = "Slower",
  rightLabel = "Faster",
  className,
  ...props
}: RangeFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="field-label">{label}</span>
        {valueLabel ? (
          <span className="text-xs text-muted tabular-nums">{valueLabel}</span>
        ) : null}
      </div>

      <input
        type="range"
        className={cx("w-full accent-primary", className)}
        {...props}
      />

      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </label>
  );
}
