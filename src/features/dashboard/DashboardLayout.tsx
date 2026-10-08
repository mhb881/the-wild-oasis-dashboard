import type { ComponentPropsWithRef } from "react";

import TodayActivity from "../check-in-out/TodayActivity";
import DurationChart from "./DurationChart";
import SalesChart from "./SalesChart";
import Stats from "./Stats";

interface DashboardLayoutProps extends ComponentPropsWithRef<"div"> {
  children?: React.ReactNode;
}

function DashboardLayout({ children, ...props }: DashboardLayoutProps) {
  return (
    <div
      className="grid grid-cols-4 grid-rows-[auto_auto_auto] gap-10 wrap-break-word"
      {...props}
    >
      <Stats />
      <TodayActivity />
      <DurationChart />
      <SalesChart />
    </div>
  );
}

export default DashboardLayout;
