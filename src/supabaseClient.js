import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ehjvanslwfmxeouuzjhk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoanZhbnNsd2ZteGVvdXV6amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NDczOTgsImV4cCI6MjAyOTAyMzM5OH0.QoVT0ujbUCWOJq_2boaby1sb4xHbAlQ1_kQhnKXnliA"
);
