import { useMutation } from "@tanstack/react-query";
import { createGuest as createGuestApi } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useCreateGuest() {
  const { mutate: createGuest, isLoading } = useMutation({
    mutationFn: createGuestApi,

    onSuccess: (data) => {
      const id = data?.data[0]?.id;
      toast.success(`Guest created successfully with id ${id}`);
    },
  });

  return { createGuest, isLoading };
}
