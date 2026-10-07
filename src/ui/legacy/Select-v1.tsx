import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils/cn";

interface CustomOption {
  value: string;
  label: string;
  description?: string; // 支持副标题
  icon?: React.ReactNode; // 支持图标
}

interface CustomSelectProps {
  options: CustomOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Select = ({
  options,
  placeholder = "请选择...",
  onChange,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部自动收起下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) onChange(value);
  };

  return (
    <div className="relative w-72" ref={containerRef}>
      {/* 触发按钮 (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-gray-900 shadow-sm transition-all duration-200",
          "focus:border-brand-600 focus:ring-brand-500/10 hover:bg-gray-50 focus:ring-4 focus:outline-none",
          isOpen && "border-brand-600 ring-brand-500/10 ring-4",
        )}
      >
        <span className="flex items-center gap-2.5 truncate">
          {selectedOption?.icon}
          <span className={cn(!selectedOption && "font-normal text-gray-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        {/* 旋转的小箭头 */}
        <ChevronDown
          className={`flex h-5 w-5 items-center justify-center transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* 下拉选项面板 (Dropdown Panel) */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-100 bg-white p-1 shadow-xl duration-150">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-150",
                  "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                  isSelected &&
                    "bg-brand-50/70 text-brand-600 hover:bg-brand-50 font-semibold",
                )}
              >
                {/* 左侧：图标 + (标题与副标题) */}
                <div className="flex items-center gap-3 truncate">
                  {option.icon && (
                    <span
                      className={cn(
                        "text-gray-400",
                        isSelected && "text-brand-500",
                      )}
                    >
                      {option.icon}
                    </span>
                  )}
                  <div className="flex flex-col truncate">
                    <span
                      className={cn(
                        "text-gray-900",
                        isSelected && "text-brand-600",
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span
                        className={cn(
                          "mt-0.5 text-xs font-normal text-gray-400",
                          isSelected && "text-brand-500",
                        )}
                      >
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* 右侧：选中时的 Check 标记 */}
                {isSelected && (
                  <div className="text-brand-600">
                    <Check className="size-4 shrink-0" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;

