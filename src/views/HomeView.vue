<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t("home.title") }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ $t("home.subtitle") }}
        </p>
      </div>

      <!-- Nuevo botón para crear participante -->
      <button
        v-if="userId === 'ca544172-2460-4959-9c59-7d7e1ad57568'"
        @click="openCreateModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ $t("home.create_button") }}
      </button>
    </div>

    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar participante por nombre..."
          class="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          @input="handleSearch"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg
            class="h-5 w-5 text-gray-400 hover:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <!-- Modifica la parte del spinner -->
      <div v-if="loading && searchHasStarted" class="p-6 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"
        ></div>
      </div>

      <!-- Si está cargando pero es la carga inicial, muestra algo diferente o nada -->
      <div v-else-if="loading && !searchHasStarted" class="p-6 text-center">
        <!-- Puedes mostrar otro mensaje o quitar esto para no mostrar nada -->
        <p class="text-gray-600 dark:text-gray-400">Inicializando...</p>
      </div>

      <div v-else-if="error" class="p-6 text-center">
        <div
          class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
        >
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-else-if="participants.length === 0" class="p-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{
            searchQuery && searchHasStarted
              ? $t("home.no_results")
              : $t("home.search_prompt")
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("home.table.name") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("home.table.age") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("home.table.stake") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("home.table.ward") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("home.table.group_company") }}
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr
              v-for="participant in participants"
              :key="participant.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              @click="viewParticipant(participant.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ participant.full_name }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300"
              >
                {{ participant.age }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300"
              >
                {{ participant.stake_or_district }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300"
              >
                {{ participant.ward_or_branch }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300"
              >
                G: {{ participant.group }} / C: {{ participant.company }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click.stop="viewParticipant(participant.id)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  {{ $t("home.table.view") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para crear participante -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t("home.create_modal.title") }}
            </h2>
            <button
              @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <participant-form
            :saving="saving"
            @submit="handleCreateSubmit"
            @cancel="closeCreateModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useParticipantsStore } from "@/stores/participants";
import { useAuthStore } from "@/stores/auth";
import ParticipantForm from "@/components/ParticipantForm.vue";
import { Participant } from "@/supabase";

const router = useRouter();
const participantsStore = useParticipantsStore();
const authStore = useAuthStore();

const userId = computed(() => authStore.user?.id);

const searchQuery = ref(participantsStore.lastSearchQuery || "");
const searchTimeout = ref<number | null>(null);

const participants: any = computed(() => participantsStore.participants);
const loading = computed(() => participantsStore.loading);
const error = computed(() => participantsStore.error);

const searchHasStarted = ref(false);
const showCreateModal = ref(false);
const saving = ref(false);

watch(
  () => participantsStore.lastSearchQuery,
  (newQuery) => {
    searchQuery.value = newQuery;
  }
);

// Función para manejar la búsqueda con debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Indicar que la búsqueda ha comenzado solo si hay texto
  searchHasStarted.value = !!searchQuery.value.trim();

  searchTimeout.value = setTimeout(() => {
    // Actualizar el store con la consulta actual
    participantsStore.searchQuery = searchQuery.value;
    fetchParticipants();
  }, 300) as unknown as number;
};

// Función para limpiar la búsqueda
const clearSearch = () => {
  searchQuery.value = "";
  participantsStore.searchQuery = "";
  participantsStore.lastSearchQuery = "";
  searchHasStarted.value = false;
  participants.value = []; // Limpiar resultados directamente
  fetchParticipants(); // Esto ahora establecerá participants como un array vacío
};

// Función para obtener los participantes
const fetchParticipants = () => {
  // Solo se mostrarán resultados si hay un texto de búsqueda
  participantsStore.fetchParticipants(searchQuery.value);
};

// Función para ver el detalle de un participante
const viewParticipant = (id: number) => {
  router.push(`/participant/${id}`);
};

// Función para abrir el modal de creación
const openCreateModal = () => {
  showCreateModal.value = true;
};

// Función para cerrar el modal de creación
const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Función para manejar el envío del formulario de creación
const handleCreateSubmit = async (data: Partial<Participant>) => {
  saving.value = true;
  try {
    const result = await participantsStore.createParticipant(data as any);
    if (result.success) {
      closeCreateModal();
      // Si hay un ID, redirigir a la página de detalles
      if (result.data && result.data.id) {
        router.push(`/participant/${result.data.id}`);
      }
    } else {
      // Mostrar error (puedes implementar un sistema de notificaciones)
      console.error("Error al crear participante:", result.error);
    }
  } catch (error) {
    console.error("Error inesperado:", error);
  } finally {
    saving.value = false;
  }
};

// Modificar la sección onMounted
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated()) {
    router.push("/login");
    return;
  }

  // Si tenemos una búsqueda guardada, indicar que ya ha comenzado la búsqueda y ejecutarla
  if (searchQuery.value && searchQuery.value.trim() !== "") {
    searchHasStarted.value = true;
    await fetchParticipants();
  } else {
    // Inicializar con lista vacía
    searchHasStarted.value = false;
    participantsStore.participants = [];
  }

  // Configurar suscripción en tiempo real
  participantsStore.setupRealtimeSubscription();
});
</script>
