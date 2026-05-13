import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function TextField({ label, className, ...props }: Props) {
  return (
    <label className="flex flex-col gap-2">
      <span className="kicker">{label}</span>
      <input className={cx("input-base", className)} {...props} />
    </label>
  );
}
