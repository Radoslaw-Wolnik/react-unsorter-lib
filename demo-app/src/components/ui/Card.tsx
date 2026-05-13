import type { PropsWithChildren } from "react";
import { cx } from "@/lib/cx";

type Props = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: Props) {
  return <div className={cx("panel-card", className)}>{children}</div>;
}
