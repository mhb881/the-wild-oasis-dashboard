import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  type?: HeadingType;
  as?: HeadingType;
}

function Heading({
  type,
  as,
  children,
  className,
  ...props
}: HeadingProps) {
  const headingType = as || type || "h3";
  const Element = headingType;

  return (
    <Element
      {...props}
      className={cn(
        headingType === "h1" && "text-5xl font-semibold",
        headingType === "h2" && "text-4xl font-semibold",
        headingType === "h3" && "text-3xl font-medium",
        headingType === "h4" && "text-2xl",
        headingType === "h5" && "text-xl",
        headingType === "h6" && "text-lg",
        className,
      )}
    >
      {children}
    </Element>
  );
}

export default Heading;
