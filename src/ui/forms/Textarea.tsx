import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  /** 是否为错误状态，与普通 Input 保持统一 API */
  error?: boolean;
}

const Textarea = ({ className, error, disabled, ...props }: TextareaProps) => {
  return (
    <textarea
      disabled={disabled}
      {...props}
      className={cn(
        // 基础样式：与普通 Input 视觉完全对齐
        "w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800",
        "transition-colors duration-200 outline-none placeholder:text-gray-400",
        "min-h-[80px] resize-y", // 支持垂直拖动调整高度，设置最小高度限制
        // 默认状态
        !error && "border-gray-300 hover:border-gray-400",
        // 聚焦状态：统一使用品牌色，与整套表单视觉呼应
        !error && "focus:border-brand-500 focus:ring-brand-100 focus:ring-2",
        // 错误状态：与 Input / FileInput 错误态完全一致
        error &&
          "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100",
        // 禁用状态
        disabled &&
          "cursor-not-allowed bg-gray-50 opacity-60 hover:border-gray-300",
        className,
      )}
    />
  );
};

export default Textarea;

