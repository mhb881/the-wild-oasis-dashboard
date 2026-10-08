import { Calendar, House, HousePlus, type LucideProps, Settings, Users } from 'lucide-react';
import type { ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router";

import { cn } from '../../lib/utils/cn';
import IconWrapper from '../data-display/IconWrapper';

// 移除了未使用的 MainNavProps 接口
interface NavLinkProps {
  to: string;
  icon?: ReactElement<LucideProps>;
  children: ReactNode;
  className?: string;
  // 保留 active 作为可选手动覆盖（兼容手动控制）
  active?: boolean;
}

function NavLink({ icon, children, className, active, to }: NavLinkProps) {
  // 1. 获取当前浏览器的路由路径
  const location = useLocation();
  // 2. 自动计算激活状态：路由匹配则激活（优先级：手动active > 自动匹配）
  const isActive = active ?? location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "group flex items-center gap-3 text-gray-00 text-base font-medium px-6 py-3 transition-all duration-300  hover:bg-gray-100 hover:rounded-sm",
          isActive ? "text-gray-800 bg-gray-100 rounded-sm" : "",
          className
        )}
      >
        {/* 给图标添加固定类名 nav-icon，用于样式控制 */}
        <IconWrapper isActive={isActive} className={cn("group-hover:text-brand-500", isActive ? "text-brand-500" : "")}>
          {icon}
        </IconWrapper>
        {/* {icon &&
          React.cloneElement(icon, {
            className: cn(icon.props.className, "group-hover:text-brand-500", isActive ? "text-brand-500" : ""),
          })
        } */}
        {children}
      </Link>
    </li >
  );
}

function MainNav() {
  return (
    <nav className="w-full">
      <ul className="flex flex-col gap-4">
        {/* 无需手动传 active，自动匹配路由 */}
        <NavLink icon={<House />} to="/dashboard">首页</NavLink>
        <NavLink icon={<Calendar />} to="/bookings">订单</NavLink>
        <NavLink icon={<HousePlus />} to="/cabins">林间木屋</NavLink>
        <NavLink icon={<Users />} to="/users">用户</NavLink>
        <NavLink icon={<Settings />} to="/settings">设置</NavLink>
      </ul>
    </nav>
  );
}

export { MainNav, NavLink };
