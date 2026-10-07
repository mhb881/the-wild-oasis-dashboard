import type { ComponentPropsWithRef } from "react";

import { Filter, TableOperations } from "~/ui";

interface DashboardFilterProps extends ComponentPropsWithRef<"div"> {
  children?: React.ReactNode;
}

function DashboardFilter({ children, ...props }: DashboardFilterProps) {
  return (
    <div {...props}>
      <TableOperations>
        <Filter
          filterField="last"
          options={[
            { value: "7", label: "最近 7 天内" },
            { value: "30", label: "最近 30 天内" },
            { value: "90", label: "最近 90 天内" },
          ]}
        />
      </TableOperations>
    </div>
  );
}

export default DashboardFilter;
