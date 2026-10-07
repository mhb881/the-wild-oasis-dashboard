import type { ComponentPropsWithRef } from "react";

interface DashboardLayoutProps extends ComponentPropsWithRef<"div"> {
  children: React.ReactNode;
}

function DashboardLayout({ children, ...props }: DashboardLayoutProps) {
  return (
    <div
      className="grid grid-cols-4 grid-rows-[auto_34rem_auto] gap-10 wrap-break-word"
      {...props}
    >
      <div>Statistics</div>
      <div>Today's Activity</div>
      <div>Chart stay durations</div>
      <div>Charts sales</div>
      {children}
    </div>
  );
}

export default DashboardLayout;
