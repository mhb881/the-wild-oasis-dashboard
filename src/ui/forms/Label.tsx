import * as React from "react";

import { cn } from "../../lib/utils/cn";

const Label = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"label">) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-gray-700 select-none",
        "cursor-pointer transition-colors",
        className,
      )}
      {...props}
    />
  );
};

Label.displayName = "Label";
export default Label;

