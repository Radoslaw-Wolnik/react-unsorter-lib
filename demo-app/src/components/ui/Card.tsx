import type { PropsWithChildren } from "react";
import { cx } from "@/lib/cx";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return <div className={cx("panel-card", className)}>{children}</div>;
}
