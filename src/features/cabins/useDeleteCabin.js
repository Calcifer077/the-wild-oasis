import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  // To use query client
  const queryClient = useQueryClient();

  // 'useMutation' is used to mutate state on a server, It needs a 'mutationFn' which tells it what to do.
  // 'mutate' is a callback function to which we can attach any button.
  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    // mutationFn: (id) => deleteCabin(id),
    mutationFn: deleteCabinApi,
    // Whenever we have successfully mutated the server below will run.
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      // It says that invalidate Queries with 'queryKey' of 'cabins'. It will lead to refetching of data(only 'cabins').
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    // In case there is any error.
    // This error will come from the function which is reponsible for handling deleting of cabins which is 'deleteCabin' .
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
