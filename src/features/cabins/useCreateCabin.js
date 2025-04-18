import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

// There is a 'reset' function given to us by 'react-forms' which basically resets the fields.
// So after you create a 'cabin' you want to clear the fields but you don't have that function(reset) here. You can pass this to the 'useCreateCabin' as an argument but we don't want to do that.
// Instead what you can do it, as we are returning 'mutate', so wherever this 'mutate' is executed that will get access to 'onSuccess' and 'onError' and we are doing this in 'CreateCabinForm' which already have 'reset' function. So you can it there only.
export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabin };
}
