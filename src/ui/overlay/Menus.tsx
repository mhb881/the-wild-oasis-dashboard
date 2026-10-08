import { EllipsisVertical } from "lucide-react";
import {
  type ComponentPropsWithRef,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import useScrollLock from "../../hooks/useScrollLock";
import { cn } from "../../lib/utils/cn";

/* -------------------------------------------------------------------------------------------- */

type Position = {
  x: number;
  y: number;
};

interface MenuContextValue {
  isOpen: boolean;
  position: Position | null;
  close: () => void;
  toggle: () => void;
  setPosition: (position: Position) => void;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenusProps extends ComponentPropsWithRef<"div"> {
  className?: string;
}

interface MenusToggleProps extends ComponentPropsWithRef<"button"> {
  className?: string;
}

interface MenusListProps extends ComponentPropsWithRef<"ul"> {
  className?: string;
}

interface MenuItemProps extends Omit<ComponentPropsWithRef<"li">, "onClick"> {
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface MenuButtonProps extends ComponentPropsWithRef<"button"> {
  className?: string;
}

/* -------------------------------------------------------------------------------------------- */

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(
      "Menus sub-components must be rendered within a <Menus> parent component.",
    );
  }
  return context;
}

/* -------------------------------------------------------------------------------------------- */

function Menus({ children, className, ...props }: MenusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((cur) => !cur);
  const ref = useOutsideClick<HTMLDivElement>(close, false);

  // 菜单展开时锁定背景滑动与滚动
  useScrollLock(isOpen);

  return (
    <MenuContext.Provider
      value={{ isOpen, position, close, toggle, setPosition, setIsOpen }}
    >
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

// 等同于 MenuTrigger
function MenuToggle({ className, ...props }: MenusToggleProps) {
  const { toggle, setPosition } = useMenuContext();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.defaultPrevented) return;
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    toggle();
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "-translate-x-1 rounded-md border-none bg-none p-2 transition-all duration-200",
        "focus:ring-brand-500 hover:bg-gray-200 focus:ring-2 focus:outline-none",
        "",
        className,
      )}
      {...props}
    >
      <EllipsisVertical />
    </button>
  );
}

function MenuList({ children, className, style, ...props }: MenusListProps) {
  const { isOpen, position, close } = useMenuContext();

  // 按 Escape 键快速关闭菜单
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <ul
      data-menu-content
      style={{
        right: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        ...style,
      }}
      className={cn(
        "animate-in fade-in fixed z-50 min-w-35 overscroll-contain rounded-2xl bg-white p-1 shadow-lg duration-150",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function MenuItem({
  disabled,
  children,
  className,
  icon,
  onClick,
  ...props
}: MenuItemProps) {
  return (
    <li
      className={cn("text-lg font-normal text-gray-600", className)}
      {...props}
    >
      <MenuButton className="" disabled={disabled} onClick={onClick}>
        {icon}
        {children}
      </MenuButton>
    </li>
  );
}

function MenuButton({
  children,
  className,
  onClick,
  ...props
}: MenuButtonProps) {
  const { close } = useMenuContext();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.defaultPrevented) return;
    onClick?.(e);
    close();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full rounded-2xl border-none bg-none px-7 py-2 transition-all duration-200",
        "hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      <div className="flex -translate-x-3 items-center justify-start gap-4">
        {children}
      </div>
    </button>
  );
}

export { MenuButton, MenuItem, MenuList, Menus, MenuToggle };
