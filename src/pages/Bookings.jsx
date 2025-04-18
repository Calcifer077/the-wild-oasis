import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        {/* This button will lead to a form which will create new bookings */}
        <Button onClick={() => navigate("/bookings/createBooking")}>
          Create Booking
        </Button>
        <BookingTableOperations />
      </Row>

      <BookingTable />
    </>
  );
}

export default Bookings;
