import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../services/apiBookings";
// import { PAGE_SIZE } from "../../utils/constants";

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE);

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // : { field: "totalPrice", value: 5000, method: "gte" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  // If the url doesn't have any current page, meaning that we have just loaded the application, then set the page to '1' else to the page we are on right now.
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    isLoading,
    // We are using a default value here, because data will not exist initially
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    // Used to uniquely identify query.
    // It needs to be a array.
    // It's like a dependency array, meaning that whenver an data of this array changes 'react-query' will fetch data again
    queryKey: ["bookings", filter, sortBy, page],
    // Is responsible for querying(interacting with API).
    // We have already defined the function that will fetch the data.
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  // It is used to fetch data before the user requests it. It is done so that the user doesn't have to wait for   data to load.

  const pageCount = Math.ceil(count / PAGE_SIZE);

  // So that you don't fetch data when you are at the last page.
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () =>
        getBookings({
          filter,
          sortBy,
          page: page + 1,
        }),
    });

  // To prefetch pages on left
  // Don't fetch if we are on the first page
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () =>
        getBookings({
          filter,
          sortBy,
          page: page - 1,
        }),
    });

  return { isLoading, bookings, error, count };
}
