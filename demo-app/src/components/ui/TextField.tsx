import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="field-label">{label}</span>
      <input className={cx("input-base", className)} {...props} />
    </label>
  );
}


