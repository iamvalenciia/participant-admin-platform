import { createClient } from "@supabase/supabase-js";
import type Database from "@/types/supabase";

const supabaseUrl = "https://rjapweysbkafjktrvvwi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYXB3ZXlzYmthZmprdHJ2dndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTU5NjAsImV4cCI6MjA2MDE5MTk2MH0.104F0N_h0y9J3_3FGvOkTADoxFedXSc57PbnNhYBfcY";

// Singleton pattern: mantener una única instancia del cliente Supabase
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// Exportar para mantener compatibilidad con el código existente
export const supabase = getSupabase();
