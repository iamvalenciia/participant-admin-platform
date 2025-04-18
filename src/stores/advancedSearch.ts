import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

interface AdvancedSearchFilters {
  company?: string | number;
  stake_or_district?: string;
  ward_or_branch?: string;
  staff_created?: boolean;
  unique_bed_key?: string; // Cambia por el nombre usado en tu componente
  arrival_registered?: string | boolean;
  variety_show?: string | boolean;
  musical_program?: string | boolean;
  phone_submitted?: string | boolean;
  [key: string]: any;
}

interface SearchResult {
  success: boolean;
  data?: any[];
  error?: string;
}

export const useAdvancedSearchStore = defineStore("advancedSearch", () => {
  // Estado
  const loading = ref(false);
  const error = ref<string | null>(null);
  const participants = ref<any[]>([]);
  const lastFilters = ref<AdvancedSearchFilters>({});

  // Computed
  const hasFilters = computed(() => {
    return Object.values(lastFilters.value).some(
      (value) => value !== undefined && value !== null && value !== ""
    );
  });

  /**
   * Realiza una búsqueda avanzada de participantes basada en filtros
   */
  // En tu función searchParticipants del store

  // En tu useAdvancedSearchStore
  const searchParticipants = async (
    filters: AdvancedSearchFilters
  ): Promise<SearchResult> => {
    loading.value = true;
    error.value = null;

    try {
      // Guardar los filtros para futuras referencias
      lastFilters.value = { ...filters };

      console.log("Procesando filtros en store:", filters);

      // Iniciar consulta base
      let query = supabase
        .from("participants2")
        .select(
          "id, full_name, age, stake_or_district, ward_or_branch, group, company, unique_bed_key, arrival_registered, variety_show, musical_program, phone_submitted"
        );

      // Aplicar filtros básicos
      if (filters.company) {
        query = query.eq("company", filters.company);
      }

      if (filters.stake_or_district) {
        query = query.eq("stake_or_district", filters.stake_or_district);
      }

      if (filters.ward_or_branch) {
        query = query.eq("ward_or_branch", filters.ward_or_branch);
      }

      if (filters.staff_created === true) {
        query = query.eq("staff_created", true);
      }

      // Aplicar filtro de cama (debug específico para este filtro)
      if (filters.unique_bed_key) {
        console.log("Aplicando filtro de cama:", filters.unique_bed_key);

        if (filters.unique_bed_key === "assigned") {
          console.log("Buscando camas asignadas (unique_bed_key NO es null)");
          query = query.not("unique_bed_key", "is", null);
        } else if (filters.unique_bed_key === "unassigned") {
          console.log("Buscando camas NO asignadas (unique_bed_key ES null)");
          query = query.is("unique_bed_key", null);
        } else if (filters.unique_bed_key.startsWith("building-")) {
          const building = filters.unique_bed_key.replace("building-", "");
          console.log(`Buscando camas en edificio: ${building}`);
          query = query.ilike("unique_bed_key", `${building}_%`);
        }
      }

      // Aplicar los otros filtros booleanos
      if (filters.arrival_registered) {
        const value = filters.arrival_registered === "true";
        query = query.eq("arrival_registered", value);
      }

      if (filters.variety_show) {
        const value = filters.variety_show === "true";
        query = query.eq("variety_show", value);
      }

      if (filters.musical_program) {
        const value = filters.musical_program === "true";
        query = query.eq("musical_program", value);
      }

      if (filters.phone_submitted) {
        const value = filters.phone_submitted === "true";
        query = query.eq("phone_submitted", value);
      }

      // Ejecutar la consulta y capturar los resultados
      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        console.error("Error de Supabase:", supabaseError);
        throw supabaseError;
      }

      console.log(`Resultados encontrados: ${data?.length || 0}`);
      participants.value = data || [];

      return {
        success: true,
        data: data,
      };
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error("Error en la búsqueda:", pgError);
      error.value = pgError.message || "Error al buscar participantes";

      return {
        success: false,
        error: error.value,
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpia los filtros y resultados
   */
  const clearSearch = () => {
    lastFilters.value = {};
    participants.value = [];
  };

  // Obtener valores únicos para los filtros
  const fetchUniqueValues = async (field: string): Promise<string[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("participants2")
        .select(field)
        .order(field);

      if (supabaseError) {
        throw supabaseError;
      }

      // Extraer valores únicos
      const uniqueValues = [
        ...new Set(data.map((item) => item[field as any])),
      ].filter(Boolean);
      return uniqueValues;
    } catch (err) {
      console.error(`Error fetching unique ${field} values:`, err);
      return [];
    }
  };

  // Devolver funciones y propiedades
  return {
    loading,
    error,
    participants,
    lastFilters,
    hasFilters,
    searchParticipants,
    clearSearch,
    fetchUniqueValues,
  };
});
