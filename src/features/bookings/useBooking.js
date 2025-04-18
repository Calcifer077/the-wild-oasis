import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const { bookingId } = useParams();

  // This will return various things.
  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    // Used to uniquely identify query.
    // It needs to be a array.
    queryKey: ["booking", bookingId],
    // Is responsible for querying(interacting with API).
    // We have already defined the function that will fetch the data.
    queryFn: () => getBooking(bookingId),
    // By default react-query tries to fetch data 3 times.
    // By setting 'retry' to false, it will only try to do so a single time
    retry: false,
  });

  return { isLoading, booking, error };
}
