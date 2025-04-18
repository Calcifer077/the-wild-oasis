import { useState } from "react";
import { useCreateGuest } from "./useCreateGuest";
import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Heading from "../../ui/Heading";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";

function CreateGuestForm() {
  const [guestAlreadyExist, setGuestAlreadyExist] = useState(false);

  const { createGuest, isLoading } = useCreateGuest();

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, nationalID, nationality, countryFlag }) {
    createGuest({ fullName, email, nationalID, nationality, countryFlag }),
      { onSettled: reset };
  }

  return (
    <>
      <Heading>Create new guest</Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label="Enter Full Name of Guest"
          error={errors?.fullName?.message}
        >
          <Input
            type="text"
            disabled={guestAlreadyExist || isLoading}
            id="fullName"
            {...register("fullName", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow label="Enter Email of guest" error={errors?.email?.message}>
          <Input
            type="text"
            disabled={guestAlreadyExist || isLoading}
            id="email"
            {...register("email", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow
          label="Enter National ID of Guest"
          error={errors?.nationalID?.message}
        >
          <Input
            type="number"
            disabled={guestAlreadyExist || isLoading}
            id="nationalID"
            {...register("nationalID", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow
          label="Enter country flag of guest"
          error={errors?.countryFlag?.message}
        >
          <Input
            type="text"
            disabled={guestAlreadyExist || isLoading}
            id="countryFlag"
            {...register("countryFlag", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow
          label="Enter Nationality of guest"
          error={errors?.nationality?.message}
        >
          <Input
            type="text"
            disabled={guestAlreadyExist || isLoading}
            id="nationality"
            {...register("nationality", { required: "This field is required" })}
          />
        </FormRow>

        <Checkbox
          checked={guestAlreadyExist}
          onChange={() => setGuestAlreadyExist((guest) => !guest)}
        >
          Does the guest already exist?
        </Checkbox>

        <FormRow>
          <Button disabled={guestAlreadyExist || isLoading}>
            Create Guest
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateGuestForm;
