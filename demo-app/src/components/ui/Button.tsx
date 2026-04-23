import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "neutral" | "accent";
  active?: boolean;
  shape?: "rounded" | "pill";
};

export function Button({
  variant = "neutral",
  active = false,
  shape = "rounded",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "btn-base",
        shape === "pill" ? "btn-pill" : "btn-rounded",
        active ? "btn-active" : variant === "accent" ? "btn-accent" : "btn-neutral",
        className
      )}
      {...props}
    />
  );
}

