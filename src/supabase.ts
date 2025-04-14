import { createClient } from "@supabase/supabase-js";
import type Database from "@/types/supabase";

const supabaseUrl = "https://rjapweysbkafjktrvvwi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYXB3ZXlzYmthZmprdHJ2dndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTU5NjAsImV4cCI6MjA2MDE5MTk2MH0.104F0N_h0y9J3_3FGvOkTADoxFedXSc57PbnNhYBfcY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipo para el participante
export interface Participant {
  id: number;
  full_name: string;
  age: number;
  stake_or_district: string;
  ward_or_branch: string;
  group: number;
  company: number;
  shirt_size: string;
  medical_treatment: string;
  allergies: string;
  room: string;
}
