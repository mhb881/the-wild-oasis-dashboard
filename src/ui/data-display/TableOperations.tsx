import type { ReactNode } from "react";

interface TableOperationsProps {
  children: ReactNode;
}

const TableOperations = ({ children }: TableOperationsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">{children}</div>
  );
};

export default TableOperations;
