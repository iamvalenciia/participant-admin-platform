import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../supabase";
import Participant from "../types/supabase";
import { useAuthStore } from "./auth";

export const useParticipantsStore = defineStore("participants", () => {
  const participants = ref<Participant[]>([]);
  const currentParticipant = ref<Participant | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const lastSearchQuery = ref("");
  const authStore = useAuthStore();

  // Obtener participantes con búsqueda
  const fetchParticipants = async (query: string = "") => {
    if (!authStore.isAuthenticated()) return;

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
      // Realizar búsqueda de texto
      const { data, error: queryError } = await supabase
        .from("participants")
        .select("*")
        .textSearch("full_name", query);

      if (queryError) throw queryError;

      console.log("Data:", data);
      participants.value = data as Participant[];
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
    if (!authStore.isAuthenticated()) return;

    loading.value = true;

    try {
      const { data, error: queryError } = await supabase
        .from("participants")
        .select("*")
        .eq("id", id)
        .single();

      if (queryError) throw queryError;

      currentParticipant.value = data as Participant;
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
        .from("participants")
        .insert(data)
        .select()
        .single();

      if (createError) throw createError;

      currentParticipant.value = createdData as Participant;

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
        .from("participants")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      currentParticipant.value = updatedData as Participant;

      // Actualizar el participante en la lista si existe
      const index = participants.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        participants.value[index] = updatedData as Participant;
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
        .from("participants")
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

  return {
    participants,
    currentParticipant,
    loading,
    error,
    searchQuery,
    lastSearchQuery,
    fetchParticipants,
    fetchParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    setupRealtimeSubscription,
  };
});
