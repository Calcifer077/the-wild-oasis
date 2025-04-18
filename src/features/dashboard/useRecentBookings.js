import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBookings() {
  const [searchParams] = useSearchParams();

  // If there is no search params in the url it will be set to 7 else the one given in the url
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: bookings } = useQuery({
    // Whenever you have to pass data to a function use a callback function otherwise just pass the function there don't call it

    queryFn: () => getBookingsAfterDate(queryDate),

    // 'queryKey' that will be stored in react query cache will be a combination of 'bookings' and 'last-${numDays}'
    queryKey: ["bookings", `last-${numDays}`],
  });

  return { isLoading, bookings };
}
