import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils/cn";

interface PaginationProps {
  children?: ReactNode;
  pageInfo?: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
}

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const Pagination = ({ children, pageInfo, onPageChange }: PaginationProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      {pageInfo && (
        <p className="ml-2 text-sm">
          Showing <span className="font-semibold">{pageInfo.totalCount}</span>{" "}
          results
        </p>
      )}
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
};

const PaginationButton = ({
  active,
  children,
  className,
  ...props
}: PaginationButtonProps) => {
  return (
    <button
      className={cn(
        "bg-jonas-grey-50 hover:not(:disabled):bg-brand-600 hover:not(:disabled):text-brand-50 flex items-center justify-center gap-1 rounded-sm border-none px-3 py-1.5 text-sm font-medium transition-all duration-300",
        active && "bg-brand-600 text-brand-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Pagination, PaginationButton };
