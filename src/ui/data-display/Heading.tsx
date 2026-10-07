import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  type?: HeadingType;
}

function Heading({ type = "h3", children, ...props }: HeadingProps) {
  const Element = type || "h3";

  return (
    <Element
      {...props}
      className={cn(
        "",
        type === "h1" && "text-5xl font-semibold",
        type === "h2" && "text-4xl font-semibold",
        type === "h3" && "text-3xl font-medium",
        type === "h4" && "text-2xl",
        type === "h5" && "text-xl",
        type === "h6" && "text-lg",
      )}
    >
      {children}
    </Element>
  );
}

export default Heading;

