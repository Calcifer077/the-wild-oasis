import { getToday } from "../utils/helpers";
import supabase from "./supabase";
// import { PAGE_SIZE } from "../utils/constants";

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE);

export async function getBookings({ filter, sortBy, page }) {
  // What we have done in the 'select' command is to populate data from 'cabins' and 'guests' table.
  // We have a 'cabinId' and a 'guestId' inside our bookings which are a foreign key to some other table(cabins and guests). Using below select we are also getting data from those two table
  // '*' is used to get all the data present in the table but in case you don't want all the data you can only specify columns that you need.
  // Second argument in 'select' is to count the number of resutls. Now it will also return a variable named 'count'
  let query = supabase
    .from("bookings")
    // .select("*, cabins(name), guests(fullName, email)");
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  // FILTER
  // eq, gte looks for a particular column, field in your table and compares with the given value
  // if (filter) query = query.eq(filter.field, filter.value);
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORT
  // options accepts a boolean, if it is true it will sort in ascending order.
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookigns could not be loaded.");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date.
// Useful to get bookings created in the last 30 days, for example
// date that is passed in this function is expected to be a ISO string
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

// startDate, endDate, numNights, numGuests, cabinPrice, extrasPrice,totalPrice,status, hasBreakfast,isPaid,observations, guestId, cabinId
export async function createBooking({
  guestId,
  numGuests,
  cabinId,
  hasBreakfast,
  numNights,
  startDate,
  endDate,
  observations,
}) {
  // Find guest with that particular id

  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("*")
    .eq("id", guestId)
    .single();

  if (guestError) {
    if (guestError.code === "PGRST116") {
      throw new Error("There is no guest with this ID");
    } else {
      throw new Error("Something went wrong while fetching guest");
    }
  }

  // Find cabin with the given id
  const { data: cabin, error: cabinError } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", cabinId)
    .single();

  if (cabinError) {
    if (cabinError.code === "PGRST116") {
      throw new Error("There is no cabin with this ID!");
    } else {
      throw new Error("Something went wrong while fetching cabin!");
    }
  }

  if (numGuests > cabin.maxCapacity) {
    throw new Error(
      `Sorry, it looks like this cabin can't accomodate this many guests!`
    );
  }

  const cabinPrice = numGuests * (cabin.regularPrice - cabin.discount);
  const extrasPrice = hasBreakfast ? numNights * 15 * numGuests : 0;

  const totalPrice = cabinPrice + extrasPrice;

  const status = "unconfirmed";
  const isPaid = false;

  const booking = {
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
    guestId,
    cabinId,
  };

  // Create booking if both exists
  const { data: bookingAfterCreation, error: bookingError } = await supabase
    .from("bookings")
    .insert([booking])
    .select();

  if (bookingError) {
    throw new Error("Something went wrong while creating booking");
  }

  return { bookingAfterCreation };
}
