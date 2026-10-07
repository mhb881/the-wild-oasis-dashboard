import { type ComponentPropsWithRef, type ReactNode } from "react";

import { cn } from "../../lib/utils/cn";

type TagType = "green" | "blue" | "yellow" | "silver" | "indigo" | "red";

interface TagProps extends ComponentPropsWithRef<"span"> {
  children: ReactNode;
  type?: TagType;
}

function Tag({ className, children, type = "indigo", ...props }: TagProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase",
        type === "green" && "bg-green-100 text-green-600",
        type === "blue" && "bg-blue-100 text-blue-600",
        type === "yellow" && "bg-yellow-100 text-yellow-600",
        type === "silver" && "bg-gray-200 text-gray-600",
        type === "indigo" && "bg-indigo-100 text-indigo-600",
        type === "red" && "bg-red-100 text-red-600",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Tag;

