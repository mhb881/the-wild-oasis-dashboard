import type { ButtonHTMLAttributes } from "react";
import { useSearchParams } from "react-router";

/*
我们在创建一个过滤组件，用于在列表中过滤数据

这里是将 状态（过滤状态） 存储在 URL 中，而不是在组件的状态中。
从而能够使得这个组件能够被其他组件所使用。
 */

type FilterOption = {
  value: string;
  label: string;
};

interface FilterProps {
  filterField: string;
  options: FilterOption[];
}

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Filter({ filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams(); // 获取 URL 中的参数

  // 获取当前的过滤字段的值（状态），默认值为第一个选项的值
  const currentFilter = searchParams.get(filterField) || options[0].value;

  function handleClick(filter: string) {
    // 通过 searchParams 设置 URL 中的参数
    searchParams.set(filterField, filter); // 设置 URL 参数 discount
    if (searchParams.get("page")) {
      searchParams.delete("page");
    }
    // 然后更新 URL 中的参数
    setSearchParams(searchParams); // 也可以直接 setSearchParams({ discount: filter });
    // 刷新后，打印 URL 中的参数
    console.log("点击了过滤按钮", filter);
  }

  return (
    <div className="flex gap-1 rounded-md border border-gray-100 bg-gray-50 p-1 shadow-sm">
      {options.map((option) => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          active={option.value === currentFilter}
          disabled={option.value === currentFilter}
        >
          {option.label}
        </FilterButton>
      ))}
    </div>
  );
}

// 对应原 FilterButton
function FilterButton({
  active,
  disabled,
  children,
  ...props
}: FilterButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`enabled:hover:bg-brand-600 enabled:hover:text-brand-50 rounded-md border-none px-4 py-2 text-base font-medium transition-all duration-300 ${
        active ? "bg-brand-600 text-brand-50" : "bg-gray-0"
      } ${disabled ? "cursor-default" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export { Filter, FilterButton };
