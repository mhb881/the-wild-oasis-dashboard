import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

interface ButtonTextProps extends ComponentPropsWithRef<"button"> {
  children?: React.ReactNode;
}

const ButtonText = ({ children, className, ...props }: ButtonTextProps) => {
  return (
    <button
      className={cn(
        "text-brand-600 hover:text-brand-700 active:text-brand-700 rounded-sm border-none bg-transparent text-center font-medium transition-all duration-300",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonText;
