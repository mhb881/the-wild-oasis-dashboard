import { X } from "lucide-react";
import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import useScrollLock from "../../hooks/useScrollLock";
import { cn } from "../../lib/utils/cn";

/* ------------------------------------------------------------------------- */

interface ModalContextType {
  openName: string;
  open: (name: string) => void;
  close: () => void;
}
// ---- 2. Context 创建与 Hook 自定义 ----
const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal 子组件必须在 <Modal> 父组件内部使用");
  }
  return context;
}

/* ------------------------------------------------------------------------- */

interface ModalProps {
  children: ReactNode;
  /** 可选：外部受控模式，当前激活的 Window 标识 */
  currentOpen?: string;
  /** 可选：外部受控模式切换时的回调 */
  onOpenChange?: (name: string) => void;
}

// ---- 4. 组件实现 ----
export function Modal({ children, currentOpen, onOpenChange }: ModalProps) {
  const [internalOpenName, setInternalOpenName] = useState("");
  const isControlled = currentOpen !== undefined;
  const openName = isControlled ? currentOpen : internalOpenName;

  const close = useCallback(() => {
    if (!isControlled) {
      setInternalOpenName("");
    }
    onOpenChange?.("");
  }, [isControlled, onOpenChange]);

  const open = useCallback(
    (name: string) => {
      if (!isControlled) {
        setInternalOpenName(name);
      }
      onOpenChange?.(name);
    },
    [isControlled, onOpenChange],
  );

  // 启用滚动与滑动锁定
  useScrollLock(Boolean(openName));

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

/* ------------------------------------------------------------------------- */

interface OverlayProps {
  onClose: () => void;
}
// 背景遮罩层
function Overlay({ onClose }: OverlayProps) {
  return (
    <div
      className="animate-in fade-in fixed inset-0 touch-none bg-slate-700/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------------- */

interface OpenProps {
  children: ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  toOpen?: string; // 目标 Window 的唯一标识
  opens?: string; // 别名兼容
}

// 通过 open 函数打开模态框，将指定的 Window 显示在模态框中
function Open({ children, toOpen, opens }: OpenProps) {
  const { open } = useModal();
  const target = toOpen || opens || "";

  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      open(target);
    },
  });
}

/* ------------------------------------------------------------------------- */

type WindowRenderProps = {
  close: () => void;
  isOpen: boolean;
};

interface WindowProps {
  children: ReactNode | ((props: WindowRenderProps) => ReactNode);
  name: string; // 当前 Window 的唯一标识
  className?: string;
}

// 接受 name 属性，用于匹配当前激活的模态框
function Window({ children, name, className = "" }: WindowProps) {
  const { openName, close } = useModal();
  const isOpen = openName === name;
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus Trap 焦点管理与 Escape 监听
  useEffect(() => {
    if (!isOpen) return;

    // 记录打开前的聚焦元素，以便关闭时归还焦点
    previousActiveElement.current =
      document.activeElement as HTMLElement | null;

    // 将焦点定位至模态框主体内部
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

      // 键盘 Tab 焦点陷阱 (Focus Trap)
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
          // Shift + Tab 逆向
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab 正向
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
      // 关闭时归还焦点
      previousActiveElement.current?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // 如果点击到了外层 flex 容器的 padding 空白处，也触发关闭
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      {/* 背景遮罩 */}
      <Overlay onClose={close} />

      {/* 模态框主体卡片 */}
      <div
        ref={contentRef}
        data-modal-content
        className={cn(
          "animate-in fade-in zoom-in-95 relative max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 sm:p-10",
          className,
        )}
      >
        <button
          className="focus:ring-brand-500 absolute top-3 right-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:outline-none"
          onClick={close}
          aria-label="关闭弹窗"
        >
          <X size={20} />
        </button>

        {/* 内容容器：同时支持 Render Props 函数与向后兼容的 cloneElement 注入 */}
        <div>
          {typeof children === "function"
            ? (children as (props: WindowRenderProps) => ReactNode)({
                close,
                isOpen,
              })
            : isValidElement(children)
              ? cloneElement(
                  children as ReactElement<{
                    onCloseModel?: (e?: React.MouseEvent) => void;
                    isOpenModel?: boolean;
                    onClose?: () => void;
                    isOpen?: boolean;
                  }>,
                  {
                    onCloseModel: close,
                    isOpenModel: true,
                    onClose: close,
                    isOpen: true,
                  },
                )
              : children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;
