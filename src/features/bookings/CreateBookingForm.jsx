import { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useCreateBooking } from "./useCreateBooking";
import toast from "react-hot-toast";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Heading from "../../ui/Heading";

import { useMoveBack } from "../../hooks/useMoveBack";

// For styling 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const StyledDiv = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  border-bottom: 1px solid var(--color-grey-100);

  > div:first-child {
    font-weight: 500;
  }
`;

const StyledDateWrapper = styled.div`
  input {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #888;
    font-size: 14px;
    width: 200px;
  }
`;

function CreateBookingForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(startDate);

  const [wantToAddBreakfast, setWantToAddBreakfast] = useState(false);

  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  const { createBooking, isLoading } = useCreateBooking();

  function onSubmit({ guestId, numGuests, cabinId, observations }) {
    // We have done strip time, so that we can easily compare dates.
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Strip time

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Strip time

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0); // Strip time

    if (start < todayDate) {
      toast.error(`Start date can't be earlier than today.`);
      return;
    }

    if (end < start) {
      toast.error(`End date can't be earlier than start date.`);
    }

    const timeDiff = endDate - startDate;
    const numNights = timeDiff / (1000 * 24 * 60 * 60) + 1;

    createBooking({
      guestId,
      numGuests,
      cabinId,
      hasBreakfast: wantToAddBreakfast,
      numNights,
      startDate,
      endDate,
      observations,
    });
  }

  const moveBack = useMoveBack();

  return (
    <>
      <Heading>Create new Booking</Heading>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Enter guest ID" error={errors?.guestId?.message}>
          <Input
            type="text"
            id="guestId"
            disabled={isLoading}
            {...register("guestId", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow
          label="Enter Number of guests"
          error={errors?.numGuests?.message}
        >
          <Input
            type="number"
            id="numGuests"
            disabled={isLoading}
            {...register("numGuests", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow label="Enter Cabin Id" error={errors?.cabinId?.message}>
          <Input
            type="text"
            id="cabinId"
            disabled={isLoading}
            {...register("cabinId", { required: "This field is required" })}
          />
        </FormRow>

        <StyledDiv>
          <div>Enter start date</div>
          <StyledDateWrapper>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </StyledDateWrapper>
        </StyledDiv>

        <StyledDiv>
          <div>Enter end date</div>
          <StyledDateWrapper>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </StyledDateWrapper>
        </StyledDiv>

        <FormRow
          label="Enter Guests observations"
          error={errors?.observations?.message}
        >
          <Input
            type="text"
            id="observations"
            disabled={isLoading}
            {...register("observations")}
          />
        </FormRow>

        <Checkbox
          checked={wantToAddBreakfast}
          onChange={() => setWantToAddBreakfast((add) => !add)}
        >
          Does the guest have breakfast?
        </Checkbox>

        <ButtonGroup>
          <Button disabled={isLoading}>Create Booking</Button>

          <Button variation="secondary" onClick={moveBack} disabled={isLoading}>
            Back
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
}

export default CreateBookingForm;
