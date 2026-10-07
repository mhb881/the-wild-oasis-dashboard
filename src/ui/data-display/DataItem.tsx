import type { ReactNode } from "react";

interface DataItemProps {
  icon?: ReactNode;
  label?: string;
  children?: ReactNode;
  /** 是否显示底部分隔线 */
  divider?: boolean;
  /** 标签列宽度，统一对齐用 */
  labelWidth?: string;
}

const DataItem = ({
  icon,
  label,
  children,
  divider = false,
  labelWidth = "100px",
}: DataItemProps) => {
  return (
    <div
      className={`grid items-start gap-4 py-3 ${
        divider ? "border-b border-gray-100 last:border-b-0" : ""
      }`}
      style={{ gridTemplateColumns: `${labelWidth} 1fr` }}
    >
      {/* 语义化标签 dt */}
      <dt className="flex shrink-0 items-center gap-2 text-base font-medium text-gray-500">
        {icon && (
          <span className="flex items-center text-gray-400">{icon}</span>
        )}
        {label}
      </dt>

      {/* 语义化内容 dd */}
      <dd className="min-w-0 text-base wrap-break-word">{children}</dd>
    </div>
  );
};

/** 外层列表容器，批量使用时推荐搭配 */
const DataList = ({ children }: { children: ReactNode }) => {
  return <dl className="w-full">{children}</dl>;
};

export { DataList };
export default DataItem;
