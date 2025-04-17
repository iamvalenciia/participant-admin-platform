import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../supabase";
import Participant from "../types/supabase";
import { useAuthStore } from "./auth";
import { BedAssignmentInfo, ParticipantType } from "../types/utlity";

export const useParticipantsStore = defineStore("participants", () => {
  const participants = ref<ParticipantType[]>([]);
  const currentParticipant = ref<ParticipantType | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const lastSearchQuery = ref("");
  const authStore = useAuthStore();

  // Obtener participantes con búsqueda
  // In your participants store, replace the fetchParticipants function with this:

  const fetchParticipants = async (query: string = "") => {
    // if (!authStore.isAuthenticated()) return;

    // Si la consulta está vacía, establecer la lista de participantes como vacía
    if (!query || query.trim() === "") {
      participants.value = [];
      lastSearchQuery.value = "";
      loading.value = false;
      return;
    }

    // Activar loading cuando hay una búsqueda activa
    loading.value = true;

    console.log("Fetching participants with query:", query);
    lastSearchQuery.value = query;

    try {
      // Formatea la consulta para búsqueda de texto adecuadamente
      // En lugar de usar textSearch directamente, hacemos un ilike para cada palabra
      let supabaseQuery = supabase.from("participants2").select("*");

      // Si hay múltiples palabras, aplicamos un filtro ilike para cada una
      const words = query.trim().split(/\s+/);

      if (words.length === 1) {
        // Si solo hay una palabra, usamos ilike simple
        supabaseQuery = supabaseQuery.ilike("full_name", `%${words[0]}%`);
      } else {
        // Para múltiples palabras, aplicamos un filtro AND para cada palabra
        words.forEach((word, index) => {
          supabaseQuery = supabaseQuery.ilike("full_name", `%${word}%`);
        });
      }

      const { data, error: queryError } = await supabaseQuery;

      if (queryError) throw queryError;

      console.log("Data:", data);
      participants.value = data;

      console.log("Participants.value data saved:", participants.value);
    } catch (err: any) {
      console.error("Error al obtener participantes:", err);
      error.value = err.message || "Error al obtener participantes";
    } finally {
      loading.value = false;
    }
  };

  // Configurar suscripción en tiempo real
  const setupRealtimeSubscription = () => {
    if (!authStore.isAuthenticated()) return;

    // Primero eliminamos cualquier suscripción anterior
    supabase.removeAllChannels();

    // Configurar la nueva suscripción
    const channel = supabase
      .channel("public:participants")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          // Actualizar la lista al recibir cambios
          fetchParticipants(searchQuery.value);
        }
      )
      .subscribe();

    return channel;
  };

  // Obtener un participante por ID
  const fetchParticipantById = async (id: number) => {
    // if (!authStore.isAuthenticated()) return;

    loading.value = true;

    try {
      const { data, error: queryError } = await supabase
        .from("participants2")
        .select("*")
        .eq("id", id)
        .single();

      if (queryError) throw queryError;

      currentParticipant.value = data;
    } catch (err: any) {
      console.error(`Error al obtener participante id=${id}:`, err);
      error.value = err.message || "Error al obtener el participante";
    } finally {
      loading.value = false;
    }
  };

  // Crear un nuevo participante
  const createParticipant = async (data: Partial<Participant>) => {
    if (!authStore.isAuthenticated())
      return { success: false, error: "No autenticado" };

    loading.value = true;

    try {
      const { data: createdData, error: createError } = await supabase
        .from("participants2")
        .insert(data)
        .select()
        .single();

      if (createError) throw createError;

      currentParticipant.value = createdData;

      // Si hay una búsqueda activa, actualizar la lista
      if (searchQuery.value) {
        fetchParticipants(searchQuery.value);
      }

      return { success: true, data: createdData };
    } catch (err: any) {
      console.error("Error al crear participante:", err);
      error.value = err.message || "Error al crear el participante";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Actualizar un participante
  const updateParticipant = async (id: number, data: Partial<Participant>) => {
    if (!authStore.isAuthenticated())
      return { success: false, error: "No autenticado" };

    loading.value = true;

    try {
      const { data: updatedData, error: updateError } = await supabase
        .from("participants2")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      currentParticipant.value = updatedData;

      // Actualizar el participante en la lista si existe
      const index = participants.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        participants.value[index] = updatedData;
      }

      return { success: true, data: updatedData };
    } catch (err: any) {
      console.error(`Error al actualizar participante id=${id}:`, err);
      error.value = err.message || "Error al actualizar el participante";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Eliminar un participante
  const deleteParticipant = async (id: number) => {
    if (!authStore.isAuthenticated())
      return { success: false, error: "No autenticado" };

    loading.value = true;

    try {
      const { error: deleteError } = await supabase
        .from("participants2")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Limpiar el participante actual si es el que se está eliminando
      if (currentParticipant.value && currentParticipant.value.id === id) {
        currentParticipant.value = null;
      }

      // Eliminar el participante de la lista si existe
      participants.value = participants.value.filter((p) => p.id !== id);

      return { success: true };
    } catch (err: any) {
      console.error(`Error al eliminar participante id=${id}:`, err);
      error.value = err.message || "Error al eliminar el participante";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateCurrentParticipantBedInfo = (bedInfo: BedAssignmentInfo) => {
    if (currentParticipant.value) {
      currentParticipant.value = {
        ...currentParticipant.value,
        building: bedInfo.building_name,
        floor: bedInfo.floor_code,
        bed: bedInfo.bed_number,
      };
    }
  };

  return {
    participants,
    currentParticipant,
    loading,
    error,
    searchQuery,
    lastSearchQuery,
    fetchParticipants,
    fetchParticipantById,
    updateCurrentParticipantBedInfo,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    setupRealtimeSubscription,
  };
});
