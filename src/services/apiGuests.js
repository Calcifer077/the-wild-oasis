import supabase from "./supabase";

export async function createGuest({
  fullName,
  email,
  nationalID,
  nationality,
  countryFlag,
}) {
  const { data, error } = await supabase
    .from("guests")
    .insert([{ fullName, email, nationalID, nationality, countryFlag }])
    .select("*");

  if (error) {
    throw new Error("Guest could not be created");
  }

  return { data };
}
