import { useQuery } from "@tanstack/react-query";

import { getCabins } from "../../services/apiCabins";
import type { Cabin } from "../../types/types";

export default function useCabins() {
  const {
    data: cabins,
    isPending,
    error,
  } = useQuery<Cabin[]>({
    queryKey: ["cabins"],
    queryFn: () => getCabins(),
  });

  return {
    cabins,
    isPending,
    error,
  };
}
