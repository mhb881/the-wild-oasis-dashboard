import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

type RowLayoutType = "horizontal" | "vertical";

interface RowLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  type?: RowLayoutType;
}

function RowLayout({
  type = "horizontal",
  className,
  children,
  ...props
}: RowLayoutProps) {
  return (
    <div
      className={cn(
        "flex",
        type === "horizontal" && "items-center justify-between",
        type === "vertical" && "flex-col",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default RowLayout;

