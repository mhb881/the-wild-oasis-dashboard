import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  error?: boolean;
}

const FileInput = ({
  className,
  error,
  disabled,
  ...props
}: FileInputProps) => {
  return (
    <input
      type="file"
      disabled={disabled}
      {...props}
      className={cn(
        // 基础样式：与普通 Input 对齐
        "w-full rounded-lg border bg-white px-2 py-1.5 text-sm text-gray-700",
        "transition-all duration-200 outline-none",
        // 默认状态
        !error && "border-gray-300 hover:border-gray-400",
        // 聚焦状态
        !error && "focus:border-brand-500 focus:ring-brand-100 focus:ring-2",
        // 错误状态
        error &&
          "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100",
        // 禁用状态
        disabled &&
          "cursor-not-allowed bg-gray-50 opacity-60 hover:border-gray-300",
        // 原生文件按钮美化
        "file:mr-3 file:rounded-md file:border-none",
        "file:font-inherit file:px-3 file:py-1.5 file:font-medium",
        "file:bg-brand-600 file:text-brand-50 file:cursor-pointer",
        "file:hover:bg-brand-700 file:transition-colors file:duration-200",
        className,
      )}
    />
  );
};

export default FileInput;

