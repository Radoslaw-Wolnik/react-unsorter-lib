import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label:       string;
  valueLabel?: string;
  leftLabel?:  string;
  rightLabel?: string;
};

export function RangeField({
  label,
  valueLabel,
  leftLabel  = "Slower",
  rightLabel = "Faster",
  className,
  ...props
}: Props) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="kicker">{label}</span>
        {valueLabel && (
          <span className="text-[11px] tabular-nums text-[--color-muted]">
            {valueLabel}
          </span>
        )}
      </div>
      <input
        type="range"
        className={cx("w-full gradient-track", className)}
        {...props}
      />
      <div className="flex justify-between text-[10px] text-[--color-muted]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </label>
  );
}
