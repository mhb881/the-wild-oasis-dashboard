import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

interface ButtonGroupProps extends ComponentPropsWithRef<"div"> {
  children?: React.ReactNode;
}

const ButtonGroup = ({ children, className, ...props }: ButtonGroupProps) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export default ButtonGroup;
