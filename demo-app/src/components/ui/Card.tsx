import type { PropsWithChildren } from "react";
import { cx } from "@/lib/cx";

type Props = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: Props) {
  return (
    <div
      className={cx(
        "rounded-xl border border-[--color-border-soft] bg-[--color-panel]",
        className,
      )}
    >
      {children}
    </div>
  );
}
