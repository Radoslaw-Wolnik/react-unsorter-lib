import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "neutral" | "accent";
export type ButtonShape   = "rounded" | "pill";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  active?:  boolean;
  shape?:   ButtonShape;
};

export function Button({
  variant = "neutral",
  active  = false,
  shape   = "rounded",
  type    = "button",
  className,
  ...props
}: Props) {
  const variantClass = active
    ? "btn-active"
    : variant === "accent"
    ? "btn-accent"
    : "btn-neutral";

  return (
    <button
      type={type}
      className={cx("btn", shape === "pill" && "btn-pill", variantClass, className)}
      {...props}
    />
  );
}
