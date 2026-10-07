import type { ReactNode } from "react";

import { cn } from "../../lib/utils/cn";

interface TableProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
  columns: string;
}

interface TableRowProps {
  children: ReactNode;
  columns: string;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableFooterProps {
  children: ReactNode;
}

const Table = ({ children }: TableProps) => {
  return (
    <div className="border-jonas-grey-200 bg-jonas-grey-0 overflow-hidden rounded-md border text-sm">
      {children}
    </div>
  );
};

const TableHeader = ({ children, columns }: TableHeaderProps) => {
  return (
    <div
      className="bg-jonas-grey-50 border-jonas-grey-100 text-jonas-grey-600 border-b px-6 py-4 font-semibold tracking-wider uppercase"
      style={{ gridTemplateColumns: columns }}
    >
      <div
        className="grid items-center gap-6"
        style={{ gridTemplateColumns: columns }}
      >
        {children}
      </div>
    </div>
  );
};

const TableRow = ({ children, columns }: TableRowProps) => {
  return (
    <div className="border-jonas-grey-100 border-b px-6 py-3 last:border-b-0">
      <div
        className="grid items-center gap-6"
        style={{ gridTemplateColumns: columns }}
      >
        {children}
      </div>
    </div>
  );
};

const TableBody = ({ children }: TableBodyProps) => {
  return <section className="my-1">{children}</section>;
};

const TableFooter = ({ children }: TableFooterProps) => {
  return (
    <footer className="bg-jonas-grey-50 flex justify-center p-3">
      {children}
    </footer>
  );
};

export { Table, TableBody, TableFooter, TableHeader, TableRow };

