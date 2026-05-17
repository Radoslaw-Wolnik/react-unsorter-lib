import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function TextField({ label, className, ...props }: Props) {
  return (
    <label className="flex flex-col gap-2">
      <span className="kicker">{label}</span>
      <input
        className={cx(
          // font-mono: inputs accept numeric/code values, monospace aids alignment
          "w-full rounded-lg border border-[--color-border] bg-[--color-bg]/70",
          "px-3 py-2.5 font-mono text-sm text-[--color-text] outline-none transition-colors",
          "placeholder:text-[--color-muted] placeholder:font-sans",
          "focus:border-[--color-primary]/50 focus:ring-1 focus:ring-[--color-primary]/10",
          className,
        )}
        {...props}
      />
    </label>
  );
}
