import Row from "../ui/Row";
import CreateBookingForm from "../features/bookings/CreateBookingForm";
import CreateGuestForm from "../features/guests/CreateGuestForm";

function CreateBooking() {
  return (
    <Row>
      <CreateGuestForm />
      <CreateBookingForm />
    </Row>
  );
}

export default CreateBooking;
