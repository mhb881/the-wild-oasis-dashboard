import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useSearchParams } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../forms/Select";

type SortByOption = {
  value: string;
  label: string;
};

interface SortByProps {
  options: SortByOption[];
}
function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";
  const desc = searchParams.get("desc") || "";

  function handleChange(newVal: string) {
    if (sortBy !== newVal) {
      searchParams.set("desc", "false");
    } else {
      if (desc === "false") {
        searchParams.set("desc", "true");
      } else {
        searchParams.set("desc", "false");
      }
    }
    searchParams.set("sortBy", newVal);
    setSearchParams(searchParams);
  }

  return (
    <div>
      <Select value={sortBy} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="请选择排序方式">
            {desc &&
              (desc === "false" ? (
                <ArrowUpIcon size={16} />
              ) : (
                <ArrowDownIcon size={16} />
              ))}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortBy;
