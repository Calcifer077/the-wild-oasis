import { createClient } from "@supabase/supabase-js";

// import { SUPABASE_URL } from "../utils/constants";
// import { SUPABASE_KEY } from "../utils/constants";
const url = import.meta.env.VITE_SUPABASE_URL;
const api = import.meta.env.VITE_SUPABASE_KEY;

export const supabaseUrl = url;

const supabaseKey = api;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
