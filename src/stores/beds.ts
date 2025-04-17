// stores/beds.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../supabase";
import { useAuthStore } from "./auth";
import type { BedType, BedAssignmentInfo } from "../types/utlity";

export const useBedsStore = defineStore("beds", () => {
  const availableBeds = ref<BedType[]>([]);
  const occupiedBeds = ref<BedType[]>([]);
  const currentBed = ref<BedType | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  // Filtros para búsqueda de camas
  const filters = ref({
    building: "",
    floor: "",
    onlyAvailable: true,
  });

  // Lista de edificios para filtros
  const buildings = ref<string[]>([]);
  // Lista de pisos para filtros
  const floors = ref<{ [building: string]: string[] }>({});

  // Cargar lista de edificios y pisos
  const loadBuildingsAndFloors = async () => {
    if (!authStore.isAuthenticated()) return;

    loading.value = true;

    try {
      // Establecer los edificios manualmente
      buildings.value = ["Abish", "Ammon", "Ester", "Moroni"];

      // Establecer los pisos manualmente - los mismos para todos los edificios
      const pisos = ["1A", "1B", "2A", "2B"];

      // Crear un mapa de pisos para cada edificio
      const floorsMap: { [building: string]: string[] } = {};

      // Asignar los mismos pisos a cada edificio
      for (const building of buildings.value) {
        floorsMap[building] = [...pisos]; // Copia del array de pisos para cada edificio
      }

      floors.value = floorsMap;
    } catch (err: any) {
      console.error("Error al cargar edificios y pisos:", err);
      error.value = err.message || "Error al cargar datos";
    } finally {
      loading.value = false;
    }
  };

  // Obtener camas disponibles
  const fetchAvailableBeds = async () => {
    if (!authStore.isAuthenticated()) return;

    loading.value = true;

    try {
      let query = supabase.from("available_beds").select("*");

      // Aplicar filtros si existen
      if (filters.value.building) {
        query = query.eq("building_name", filters.value.building);
      }

      if (filters.value.floor) {
        query = query.eq("floor_code", filters.value.floor);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      availableBeds.value = data || [];
    } catch (err: any) {
      console.error("Error al obtener camas disponibles:", err);
      error.value = err.message || "Error al obtener camas disponibles";
    } finally {
      loading.value = false;
    }
  };

  // Obtener información de la cama asignada a un participante
  const fetchParticipantBed = async (
    participantId: number
  ): Promise<BedAssignmentInfo | null> => {
    if (!authStore.isAuthenticated()) return null;

    try {
      const { data, error: queryError } = await supabase
        .from("participant_beds")
        .select(
          "unique_bed_key, building_name, floor_code, bed_number, assigned_at"
        )
        .eq("participant_id", participantId)
        .maybeSingle();

      if (queryError) throw queryError;

      if (data && data.unique_bed_key) {
        return {
          unique_bed_key: data.unique_bed_key,
          building_name: data.building_name!,
          floor_code: data.floor_code!,
          bed_number: data.bed_number!,
          assigned_at: data.assigned_at || undefined,
        };
      }

      return null;
    } catch (err: any) {
      console.error(
        `Error al obtener cama del participante ${participantId}:`,
        err
      );
      return null;
    }
  };

  // Asignar una cama a un participante
  const assignBed = async (participantId: number, bedKey: string) => {
    if (!authStore.isAuthenticated()) {
      return { success: false, error: "No autenticado" };
    }

    loading.value = true;

    try {
      // Llamar al procedimiento almacenado
      const { error: procError } = await supabase.rpc("assign_bed_function", {
        p_participant_id: participantId,
        p_bed_key: bedKey,
        p_assigned_by: authStore.user?.email || "System",
      });

      if (procError) throw procError;

      // Actualizar las listas de camas
      await fetchAvailableBeds();

      return { success: true };
    } catch (err: any) {
      console.error(
        `Error al asignar cama al participante ${participantId}:`,
        err
      );
      error.value = err.message || "Error al asignar cama";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Desasignar una cama de un participante
  const unassignBed = async (participantId: number) => {
    if (!authStore.isAuthenticated()) {
      return { success: false, error: "No autenticado" };
    }

    loading.value = true;

    try {
      // Llamar al procedimiento almacenado
      const { error: procError } = await supabase.rpc("unassign_bed", {
        p_participant_id: participantId,
      });

      if (procError) throw procError;

      // Actualizar las listas de camas
      await fetchAvailableBeds();

      return { success: true };
    } catch (err: any) {
      console.error(
        `Error al desasignar cama del participante ${participantId}:`,
        err
      );
      error.value = err.message || "Error al desasignar cama";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Obtener estadísticas de ocupación
  const fetchOccupancyStats = async () => {
    if (!authStore.isAuthenticated()) return [];

    try {
      const { data, error: queryError } = await supabase.rpc(
        "get_occupancy_stats"
      );

      if (queryError) throw queryError;

      return data || [];
    } catch (err: any) {
      console.error("Error al obtener estadísticas de ocupación:", err);
      return [];
    }
  };

  return {
    availableBeds,
    occupiedBeds,
    currentBed,
    loading,
    error,
    filters,
    buildings,
    floors,
    loadBuildingsAndFloors,
    fetchAvailableBeds,
    fetchParticipantBed,
    assignBed,
    unassignBed,
    fetchOccupancyStats,
  };
});
