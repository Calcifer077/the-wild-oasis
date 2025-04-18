import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";

export function useRecentStays() {
  const [searchParams] = useSearchParams();

  // If there is no search params in the url it will be set to 7 else the one given in the url
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: stays } = useQuery({
    // Whenever you have to pass data to a function use a callback function otherwise just pass the function there don't call it

    queryFn: () => getStaysAfterDate(queryDate),

    // 'queryKey' that will be stored in react query cache will be a combination of 'stays' and 'last-${numDays}'
    queryKey: ["stays", `last-${numDays}`],
  });

  // We will not consider the guests who never showed up
  const confirmedStays = stays?.filter(
    (stay) => stay.status === "checked-in" || stay.status === "checked-out"
  );

  return { isLoading, stays, confirmedStays, numDays };
}
