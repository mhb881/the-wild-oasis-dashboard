import type { ComponentPropsWithRef } from "react";

import { cn } from "~/lib/utils/cn";

export type DashboardBoxProps = ComponentPropsWithRef<"div">;

export function DashboardBox({
  className,
  children,
  ...props
}: DashboardBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default DashboardBox;
