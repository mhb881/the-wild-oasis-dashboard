import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils/cn";

interface MenuProps {
  children: ReactNode;
}

interface MenuToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

interface MenuListProps {
  children: ReactNode;
  position: { x: number; y: number };
}

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  return <div className="flex items-center justify-end">{children}</div>;
};

const MenuToggle = ({ children, className, ...props }: MenuToggleProps) => {
  return (
    <button
      className={cn(
        "hover:bg-jonas-grey-100 translate-x-2 transform rounded-sm border-none bg-transparent p-1 transition-all duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const MenuList = ({ children, position }: MenuListProps) => {
  return (
    <ul
      className="bg-jonas-grey-0 fixed rounded-md shadow-md"
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </ul>
  );
};

const MenuButton = ({
  children,
  icon,
  className,
  ...props
}: MenuButtonProps) => {
  return (
    <li>
      <button
        className={cn(
          "hover:bg-jonas-grey-50 flex w-full items-center gap-4 border-none bg-transparent px-6 py-3 text-left text-sm transition-all duration-200",
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="text-jonas-grey-400 transition-all duration-300">
            {icon}
          </span>
        )}
        {children}
      </button>
    </li>
  );
};

export { Menu, MenuButton, MenuList, MenuToggle };

