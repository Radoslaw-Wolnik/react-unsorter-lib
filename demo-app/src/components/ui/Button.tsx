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
  // Base layout lives here as utilities — readable, co-located with the component.
  // Variant classes (btn-neutral / btn-active / btn-accent) stay in CSS only because
  // they require color-mix() gradients and multi-layer box-shadows that have no
  // Tailwind utility equivalent.
  const variantClass = active ? "btn-active" : variant === "accent" ? "btn-accent" : "btn-neutral";

  return (
    <button
      type={type}
      className={cx(
        // Layout & behaviour — all expressible as utilities
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2",
        "text-[11px] font-semibold uppercase tracking-[0.1em]",
        "transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-35",
        "select-none",
        // Shape
        shape === "pill" ? "rounded-full" : "rounded-lg",
        // Colour/surface variant — needs CSS for color-mix() gradients
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
