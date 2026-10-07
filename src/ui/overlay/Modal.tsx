import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import {
  type ComponentPropsWithRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import useScrollLock from "../../hooks/useScrollLock";
import { cn } from "../../lib/utils/cn";
import { ModalContext, useModal } from "./ModalContext";

// ---- 1. 类型声明 ----
export interface ModalProps {
  children: ReactNode;
  /** 可选外部受控模式：是否开启（布尔值或当前开启的窗口标识） */
  open?: boolean | string;
  /** 默认是否开启（布尔值或初始窗口标识） */
  defaultOpen?: boolean | string;
  /** 状态变更回调 */
  onOpenChange?: (open: boolean | string) => void;
}

export interface ModalTriggerProps
  extends ComponentPropsWithRef<"button"> {
  children: ReactNode;
  asChild?: boolean;
  /** 多窗口模式下指定目标窗口标识 */
  name?: string;
  toOpen?: string; // 别名便利
  opens?: string; // 别名便利
}

export interface ModalOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  /** 多窗口模式下当前内容对应的窗口标识 */
  name?: string;
}

export interface ModalTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export interface ModalDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export interface ModalCloseProps
  extends ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

// ---- 2. 根组件 Modal (复合架构：支持单窗口直接调用与多窗口精准路由) ----
export function Modal({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: ModalProps) {
  const [internalName, setInternalName] = useState<string>(() => {
    if (typeof defaultOpen === "string") return defaultOpen;
    return defaultOpen ? "default" : "";
  });
  const [titleId, setTitleId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(
    undefined,
  );

  const isControlled = controlledOpen !== undefined;
  const activeName = isControlled
    ? typeof controlledOpen === "boolean"
      ? controlledOpen
        ? "default"
        : ""
      : controlledOpen
    : internalName;

  const open = useCallback(
    (name: string = "default") => {
      const target = name || "default";
      if (!isControlled) {
        setInternalName(target);
      }
      onOpenChange?.(target);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => {
    if (!isControlled) {
      setInternalName("");
    }
    onOpenChange?.("");
  }, [isControlled, onOpenChange]);

  const isOpen = useCallback(
    (name?: string) => {
      if (!activeName) return false;
      if (!name || name === "default") {
        return Boolean(activeName);
      }
      return activeName === name;
    },
    [activeName],
  );

  return (
    <ModalContext.Provider
      value={{
        activeName,
        isOpen,
        open,
        close,
        titleId,
        descriptionId,
        setTitleId,
        setDescriptionId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// ---- 3. 触发器组件 (Slot asChild 机制，解耦任何按钮形式) ----
function Trigger({
  children,
  asChild = true,
  name,
  toOpen,
  opens,
  onClick,
  ...props
}: ModalTriggerProps) {
  const { open } = useModal();
  const target = name || toOpen || opens || "default";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      open(target);
    }
  };

  if (asChild && isValidElement(children)) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// ---- 4. 遮罩层组件 ----
function Overlay({ className, onClick, ...props }: ModalOverlayProps) {
  const { close } = useModal();

  return (
    <div
      className={cn(
        "animate-in fade-in fixed inset-0 touch-none bg-slate-700/40 backdrop-blur-xs transition-opacity duration-200",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          close();
        }
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// ---- 5. 模态框主体卡片 (Portal + Focus Trap + A11y 树) ----
function Content({
  children,
  className,
  showCloseButton = true,
  name,
  ...props
}: ModalContentProps) {
  const { isOpen, close, titleId, descriptionId } = useModal();
  const isContentOpen = isOpen(name);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 启用移动端与跨端无感滚动锁
  useScrollLock(isContentOpen);

  // Focus Trap 焦点管理与 Escape 监听
  useEffect(() => {
    if (!isContentOpen) return;

    // 1. 记录打开前聚焦的元素，关闭时精准归还焦点
    previousActiveElement.current =
      document.activeElement as HTMLElement | null;

    // 2. 将焦点默认定位至弹窗内部首个可交互控件
    const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }

      // Tab 键焦点回环 (Focus Trap)
      if (e.key === "Tab" && contentRef.current) {
        const focusables = Array.from(
          contentRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
          ),
        );

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isContentOpen, close]);

  if (!isContentOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={(e) => {
        // 点击外层 flex padding 空白处时自动安全退出
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <Overlay />

      <div
        ref={contentRef}
        data-modal-content
        className={cn(
          "animate-in fade-in zoom-in-95 relative max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 sm:p-10",
          className,
        )}
        {...props}
      >
        {showCloseButton && (
          <button
            type="button"
            className="focus:ring-brand-500 absolute top-3 right-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:outline-none"
            onClick={close}
            aria-label="关闭弹窗"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ---- 6. 语义标题组件 (WAI-ARIA aria-labelledby 自动关联) ----
function Title({ asChild, className, children, ...props }: ModalTitleProps) {
  const { setTitleId } = useModal();
  const generatedId = useId();
  const id = props.id || generatedId;

  useEffect(() => {
    setTitleId(id);
  }, [id, setTitleId]);

  const Comp = asChild ? Slot : "h2";
  return (
    <Comp
      id={id}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ---- 7. 语义描述组件 (WAI-ARIA aria-describedby 自动关联) ----
function Description({
  asChild,
  className,
  children,
  ...props
}: ModalDescriptionProps) {
  const { setDescriptionId } = useModal();
  const generatedId = useId();
  const id = props.id || generatedId;

  useEffect(() => {
    setDescriptionId(id);
  }, [id, setDescriptionId]);

  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      id={id}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ---- 8. 头部布局包装器 ----
function Header({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex flex-col space-y-1.5 text-left", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---- 9. 底部布局包装器 ----
function Footer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex justify-end gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---- 10. 关闭按钮组件 ----
function Close({
  children,
  asChild,
  className,
  onClick,
  ...props
}: ModalCloseProps) {
  const { close } = useModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      close();
    }
  };

  if (asChild && isValidElement(children)) {
    return (
      <Slot onClick={handleClick} className={className} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ---- 11. 组件挂载与标准命名空间绑定 ----
Modal.Trigger = Trigger;
Modal.Open = Trigger; // 别名便利
Modal.Content = Content;
Modal.Window = Content; // 别名便利
Modal.Header = Header;
Modal.Title = Title;
Modal.Description = Description;
Modal.Footer = Footer;
Modal.Close = Close;
Modal.Overlay = Overlay;
