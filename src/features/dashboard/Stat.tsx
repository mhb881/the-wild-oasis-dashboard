import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "~/lib/utils/cn";

export type StatColor =
  | "blue"
  | "green"
  | "indigo"
  | "yellow"
  | "red"
  | "purple"
  | "silver"
  | "orange";

export interface StatProps extends ComponentPropsWithRef<"div"> {
  icon: ReactNode;
  title: string;
  value: string | number;
  color?: StatColor;
}

const colorVariants: Record<StatColor, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  indigo:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  yellow:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  purple:
    "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400",
  silver: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
};

export function Stat({
  icon,
  title,
  value,
  color = "blue",
  className,
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[4rem_1fr] grid-rows-[auto_auto] items-center gap-x-4 gap-y-1 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "row-span-2 flex aspect-square items-center justify-center rounded-full transition-colors",
          "[&_svg]:h-8 [&_svg]:w-8",
          colorVariants[color],
        )}
      >
        {icon}
      </div>

      <h5 className="self-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        {title}
      </h5>

      <p className="text-2xl leading-none font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}

export default Stat;
