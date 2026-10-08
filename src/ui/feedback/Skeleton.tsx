import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

export function Skeleton({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "animate-shimmer relative overflow-hidden rounded-md bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        className,
      )}
      {...props}
    />
  );
}

export default Skeleton;
