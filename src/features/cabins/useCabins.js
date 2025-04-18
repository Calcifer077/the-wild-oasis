import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  // This will return various things.
  const { isLoading, data: cabins } = useQuery({
    // Used to uniquely identify query.
    // It needs to be a array.
    queryKey: ["cabins"],
    // Is responsible for querying(interacting with API).
    // We have already defined the function that will fetch the data.
    queryFn: getCabins,
  });

  return { isLoading, cabins };
}
