// import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

// const StyledFormRow = styled.div`
//   display: grid;
//   align-items: center;
//   grid-template-columns: 24rem 1fr 1.2fr;
//   gap: 2.4rem;

//   padding: 1.2rem 0;

//   &:first-child {
//     padding-top: 0;
//   }

//   &:last-child {
//     padding-bottom: 0;
//   }

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }

//   &:has(button) {
//     display: flex;
//     justify-content: flex-end;
//     gap: 1.2rem;
//   }
// `;

// const Label = styled.label`
//   font-weight: 500;
// `;

// const Error = styled.span`
//   font-size: 1.4rem;
//   color: var(--color-red-700);
// `;

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;

  // if 'editId' exists 'isEditSession' is true.
  const isEditSession = Boolean(editId);

  // 'register' is used to add elements into react-hook-form. You can also pass validation object in this which can be used in error handling.
  // It makes them controlled elements.
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  // this 'data' will get all the data from input elements that we have controlled(registered) using 'react-hook-form'
  // We get input fields associated with the below data. These are the name of columns on supabase.
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset();

            // Below we are optinal chainig a method call. If 'onCloseModal' doesn't exist it will not call it.
            // We are doing so because we don't know if the form was created using modal or not.
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();

            // Below we are optinal chainig a method call. If 'onCloseModal' doesn't exist it will not call it.
            // We are doing so because we don't know if the form was created using modal or not.
            onCloseModal?.();
          },
        }
      );
    // The above 'createCabin' comes from our custom hook. This custom hook uses mutations which have 'onSuccess' and 'onError' in it. We can use those right here. This also gets access to the 'data' that is returned by the async function(mutation function) in 'useCreateCabin'
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    // 'react-hook-form' will call 'onSubmit' when we submit the form.
    // 'onSubmit' is made by us.
    // Whenever you try to submit the form 'hadleSubmit' below will run making all validations run.
    // If validation fails resulting in any kind of error second function will be called which will have all those errors.
    // The 'type' props basically tells if the below form is in a modal or not which we will use in styling
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          defaultValue=""
          disabled={isWorking}
          // Second argument in 'register' is validation object.
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          defaultValue={1}
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            required: "This field is required",
            // Below is our own customer validor which will return error or not based on the boolean value inside it.
            validate: (value) =>
              // 'getValues' returns a object of all the input fields.
              // String after '||' is the error message that will be displayed.
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        disabled={isWorking}
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          type="file"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          // Below we are optinal chainig a method call. If 'onCloseModal' doesn't exist it will not call it.
          // We are doing so because we don't know if the form was created using modal or not.
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
