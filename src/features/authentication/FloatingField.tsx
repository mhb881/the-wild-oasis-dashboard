import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "../../lib/utils/cn";
import { FormRow, Input, Label } from "../../ui";

interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  hasValue: boolean;
}

function FloatingField({
  id,
  label,
  type = "text",
  autoComplete,
  register,
  error,
  hasValue,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);

  const floating = focused || hasValue;

  return (
    <FormRow type="vertical" error={error?.message} className="gap-1">
      <div className="relative">
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder=" "
          {...register}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            register.onBlur(e);
          }}
          className={cn(
            "w-full rounded-xl border bg-white px-4 pt-6 pb-3 text-sm text-gray-900 transition-all duration-200 outline-none",
            "placeholder:text-transparent",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          )}
        />

        <Label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-3 z-10 origin-left bg-white px-1 transition-all duration-200",
            floating
              ? "top-2 translate-y-0 text-xs font-medium"
              : "top-1/2 -translate-y-1/2 text-sm",
            error
              ? "text-red-500"
              : focused
                ? "text-blue-600"
                : "text-gray-500",
          )}
        >
          {label}
        </Label>
      </div>
    </FormRow>
  );
}

export default FloatingField;
