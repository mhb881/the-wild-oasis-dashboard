import type { ImgHTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

interface FlagProps extends ImgHTMLAttributes<HTMLImageElement> {
  children?: React.ReactNode;
}

const Flag = ({ className, ...props }: FlagProps) => {
  return (
    <img
      className={cn(
        "rounded-tiny border-jonas-grey-100 block max-w-8 border",
        className,
      )}
      {...props}
    />
  );
};

export default Flag;

