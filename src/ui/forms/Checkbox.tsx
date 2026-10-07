import type { ChangeEvent, ReactNode } from "react";

import { cn } from "../../lib/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id: string;
  children?: ReactNode;
  className?: string;
}

const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  id,
  children,
  className,
}: CheckboxProps) => {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="accent-brand-600 mt-1 h-5 w-5 shrink-0 rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex-1 cursor-pointer leading-7 text-gray-700 select-none",
          disabled && "cursor-not-allowed text-gray-400",
        )}
      >
        {children}
      </label>
    </div>
  );
};

export default Checkbox;

