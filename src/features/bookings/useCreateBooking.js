import { useMutation } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const { mutate: createBooking, isLoading } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("Booking created successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { createBooking, isLoading };
}
