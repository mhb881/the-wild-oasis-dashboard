import { type ComponentPropsWithRef, createContext, useContext } from "react";

import { cn } from "../../lib/utils/cn";

interface TableContextType {
  columns: string;
}

interface TableProps extends ComponentPropsWithRef<"table"> {
  columns: string;
}

interface TableHeaderProps extends ComponentPropsWithRef<"thead"> {
  className?: string;
}

interface TableRowProps extends ComponentPropsWithRef<"tr"> {
  className?: string;
}

interface TableBodyProps extends ComponentPropsWithRef<"tbody"> {
  className?: string;
}

interface TableFooterProps extends ComponentPropsWithRef<"tfoot"> {
  className?: string;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table 子组件必须在 <Table> 父组件内部使用");
  }
  return context;
}

function Table({ columns, className, children, ...props }: TableProps) {
  return (
    <table
      role="table"
      className={cn("w-full border-separate border-spacing-0", className)}
      {...props}
    >
      <TableContext.Provider value={{ columns }}>
        {children}
      </TableContext.Provider>
    </table>
  );
}

function TableHeader({ children, className, ...props }: TableHeaderProps) {
  const { columns } = useTable();

  return (
    <thead
      role="row"
      className={cn(
        "font-semibold tracking-wide text-gray-600 uppercase",
        className,
      )}
      {...props}
    >
      <tr
        className={`grid items-center gap-x-8 border-b border-gray-300 px-10 py-4 text-left`}
        style={{ gridTemplateColumns: columns }}
      >
        {children}
      </tr>
    </thead>
  );
}

function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn("", className)} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className, ...props }: TableRowProps) {
  const { columns } = useTable();
  return (
    <tr
      role="row"
      className={cn(
        `grid items-center gap-10 bg-white px-10 py-3.5 not-last:border-b not-last:border-gray-300 hover:bg-gray-100`,
        className,
      )}
      style={{ gridTemplateColumns: columns }}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableFooter({ children, className, ...props }: TableFooterProps) {
  if (!children) return null;
  return (
    <tfoot
      className={cn("flex items-center justify-center bg-gray-100", className)}
      {...props}
    >
      <tr>
        <td className="p-4 empty:hidden">{children}</td>
      </tr>
    </tfoot>
  );
}

export { Table, TableBody, TableFooter, TableHeader, TableRow };

