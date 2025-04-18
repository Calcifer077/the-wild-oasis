import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  // The below 'supabase' is the client is the one that we have created in 'supabase.js' file.
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }

  return data;
}

export async function deleteCabin(id) {
  // How below query work
  // Go to supabase->table (cabins), then delete some column which matches some column.
  // First 'id' is on supabase table, second one is given by us.
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted.");
  }
}

// We will need 'id' to differentiate whether the request is to update or create.
export async function createEditCabin(newCabin, id) {
  // It basically checks if a new image has been uploaded or not. If a new image has been uploaded it will not have 'supabase' in its url, which will be present when the data comes from supabase.
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Creating a random string for our image.
  // If image name contains any slashes 'supabase' will create folders.
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // If the image has 'hasImagePath' it means that the user doesn't wish to change the image.
  // 'cabin-images' is the name of storage bucket.
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create cabin
  let query = supabase.from("cabins");

  // Below we have only passed 'newCabin' in the array because the column name in the supabase table and our input fields are the same.
  // '.select' and '.single' is used to get the element that was just creaetd or edited which is not returned by '.insert' only.
  // const { data, error } = await supabase
  //   .from("cabins")
  //   .insert([{ ...newCabin, image: imagePath }])
  //   .select()
  //   .single();

  // CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // UPDATE
  // You don't need to use a array as you have done above.
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created.");
  }

  // 2. Upload image

  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);

    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }
  return data;
}
