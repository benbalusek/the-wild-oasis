import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://jvpbgbridnnebbxiattz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cGJnYnJpZG5uZWJieGlhdHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0OTEzNzgsImV4cCI6MjA0ODA2NzM3OH0.cJM4yYwxSk7VUkF6agJjnxmTcQty--ZF4IrngBD_EnM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
