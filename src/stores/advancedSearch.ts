import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

interface AdvancedSearchFilters {
  company?: string | number;
  stake_or_district?: string;
  ward_or_branch?: string;
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
  const searchParticipants = async (
    filters: AdvancedSearchFilters
  ): Promise<SearchResult> => {
    loading.value = true;
    error.value = null;

    try {
      // Guardar los filtros para futuras referencias
      lastFilters.value = { ...filters };

      // Iniciar consulta base
      let query = supabase.from("participants").select("*");

      // Aplicar filtros si existen
      if (filters.company) {
        query = query.eq("company", filters.company);
      }

      if (filters.stake_or_district) {
        query = query.eq("stake_or_district", filters.stake_or_district);
      }

      if (filters.ward_or_branch) {
        query = query.eq("ward_or_branch", filters.ward_or_branch);
      }

      // Ejecutar la consulta
      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      // Actualizar el estado
      participants.value = data || [];

      return {
        success: true,
        data: data,
      };
    } catch (err) {
      const pgError = err as PostgrestError;
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
        .from("participants")
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
