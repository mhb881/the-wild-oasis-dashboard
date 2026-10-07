import { Slot } from "@radix-ui/react-slot";
import { Check, ChevronDown } from "lucide-react";
import React, {
  type ComponentPropsWithRef,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from "react";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { cn } from "../../lib/utils/cn";

/* ------------------------------------------------------------------------------------------ */
/* Context Setup */
/* ------------------------------------------------------------------------------------------ */

interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedVal: string;
  setSelectedVal: (value: string) => void;
  selectedLabel: string;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select 子组件必须在 <Select> 父组件内部使用");
  }
  return context;
}

/* ------------------------------------------------------------------------------------------ */
/* Select Component */
/* ------------------------------------------------------------------------------------------ */

interface SelectProps extends Omit<ComponentPropsWithRef<"div">, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
}

// 递归收集 SelectItem 子组件的 value 和 label 属性
function collectSelectLabels(children: React.ReactNode) {
  const labels = new Map<string, string>();

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    const props = child.props as {
      value?: unknown;
      label?: unknown;
      children?: React.ReactNode;
    };

    if (typeof props.value === "string" && typeof props.label === "string") {
      labels.set(props.value, props.label);
    }

    if (props.children) {
      collectSelectLabels(props.children).forEach((label, value) => {
        labels.set(value, label);
      });
    }
  });

  return labels;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      children,
      value,
      defaultValue = "",
      onValueChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    /*
    支持受控模式与非受控模式
    受控模式下，value 优先，否则使用 defaultValue state。
    学习一下这种模式，以及它的优势。
     */
    const [internalVal, setInternalVal] = useState(defaultValue);

    // 合并外部传入的 ref 和点击外部的 ref (简单实现，若需严谨合并可使用 merge-refs 库)
    const containerRef = useOutsideClick<HTMLDivElement>(() =>
      setIsOpen(false),
    );

    // 受控值优先，否则使用内部 state
    const selectedVal = value !== undefined ? value : internalVal;
    const labels = useMemo(() => collectSelectLabels(children), [children]);
    const selectedLabel = labels.get(selectedVal) || "";

    const handleSetSelectedVal = (newVal: string) => {
      if (value === undefined) setInternalVal(newVal);
      onValueChange?.(newVal);
      onChange?.(newVal);
    };

    return (
      <SelectContext.Provider
        value={{
          isOpen,
          setIsOpen,
          selectedLabel,
          selectedVal,
          setSelectedVal: handleSetSelectedVal,
        }}
      >
        <div
          className={cn("relative w-60", className)}
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  },
);

/* ------------------------------------------------------------------------------------------ */
/* SelectTrigger Component */
/* ------------------------------------------------------------------------------------------ */

interface SelectTriggerProps extends ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-gray-900 shadow-sm transition-all duration-200",
          "focus:border-brand-600 focus:ring-brand-500/10 hover:bg-gray-50 focus:ring-4 focus:outline-none",
          isOpen && "border-brand-600 ring-brand-500/10 ring-4",
          className,
        )}
        {...props}
      >
        {children}
        {!asChild && (
          <ChevronDown
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        )}
      </Comp>
    );
  },
);

/* ------------------------------------------------------------------------------------------ */
/* SelectValue Component */
/* ------------------------------------------------------------------------------------------ */

interface SelectValueProps extends ComponentPropsWithRef<"span"> {
  placeholder?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    const { selectedVal, selectedLabel } = useSelect();

    return (
      <span
        ref={ref}
        className={cn("flex items-center gap-1 truncate", className)}
        {...props}
      >
        {children}
        <span className={cn(!selectedVal && "font-normal text-gray-400")}>
          {selectedVal ? selectedLabel : placeholder}
        </span>
      </span>
    );
  },
);

/* ------------------------------------------------------------------------------------------ */
/* SelectContent Component */
/* ------------------------------------------------------------------------------------------ */

const SelectContent = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useSelect();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-100 bg-white p-1 shadow-xl duration-150",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

/* ------------------------------------------------------------------------------------------ */
/* SelectItem Component */
/* ------------------------------------------------------------------------------------------ */

interface SelectItemProps extends ComponentPropsWithRef<"div"> {
  icon?: React.ReactNode;
  value: string;
  label: string; // 新增 label 属性，用于覆盖复杂 children 的情况
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, icon, value, label, ...props }, ref) => {
    const { selectedVal, setSelectedVal, setIsOpen } = useSelect();
    const isSelected = selectedVal === value;

    function handleSelect() {
      setSelectedVal(value);
      setIsOpen(false);
    }

    return (
      <div
        ref={ref}
        onClick={handleSelect}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors duration-150",
          "hover:bg-gray-100 focus:bg-gray-50 focus:outline-none",
          isSelected &&
            "bg-brand-50/70 text-brand-600 hover:bg-brand-50 font-semibold",
          className,
        )}
        {...props}
      >
        {/* 左侧：图标 + 内容 */}
        <div className="flex items-center gap-3 truncate">
          {icon && (
            <span
              className={cn(
                "shrink-0 text-gray-400",
                isSelected && "text-brand-500",
              )}
            >
              {icon}
            </span>
          )}
          <div className="flex flex-col truncate">
            <span
              className={cn(
                "truncate text-gray-900",
                isSelected && "text-brand-600",
              )}
            >
              {label}
            </span>
          </div>
        </div>

        {/* 右侧：选中时的 Check 标记 */}
        {isSelected && (
          <div className="text-brand-600">
            <Check className="size-4 shrink-0" />
          </div>
        )}
      </div>
    );
  },
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };

