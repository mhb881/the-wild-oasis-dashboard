import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

interface ButtonIconProps extends ComponentPropsWithRef<"button"> {
  children?: React.ReactNode;
}

const ButtonIcon = ({ children, className, ...props }: ButtonIconProps) => {
  return (
    <button
      className={cn(
        "hover:bg-jonas-grey-100 rounded-sm border-none bg-transparent p-1.5 transition-all duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonIcon;
