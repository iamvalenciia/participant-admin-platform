<template>
  <div>
    <div
      class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-teal-900 dark:text-amber-100">
          {{ $t("home.title") }}
        </h1>
        <p class="mt-2 text-teal-700 dark:text-amber-200">
          {{ $t("home.subtitle") }}
        </p>
      </div>

      <!-- Botón para crear participante -->
      <button
        v-if="isAuthenticated"
        @click="openCreateModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
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
          class="w-full px-4 py-3 pl-10 pr-10 border border-amber-300 dark:border-teal-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100"
          @input="handleSearch"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-teal-500 dark:text-amber-300"
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
            class="h-5 w-5 text-teal-500 dark:text-amber-300 hover:text-teal-700 dark:hover:text-amber-200 transition-colors"
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

    <div
      class="bg-amber-50 dark:bg-teal-950 shadow-md rounded-lg overflow-hidden"
    >
      <!-- Spinner de carga -->
      <div v-if="loading && searchHasStarted" class="p-6 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-yellow-400"
        ></div>
      </div>

      <!-- Carga inicial -->
      <div v-else-if="loading && !searchHasStarted" class="p-6 text-center">
        <p class="text-teal-700 dark:text-amber-200">Inicializando...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="p-6 text-center">
        <div
          class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
        >
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="participants.length === 0" class="p-6 text-center">
        <p class="text-teal-700 dark:text-amber-200">
          {{
            searchQuery && searchHasStarted
              ? $t("home.no_results")
              : $t("home.search_prompt")
          }}
        </p>
      </div>

      <!-- Tabla de resultados -->
      <div v-else class="overflow-x-auto">
        <table
          class="min-w-full divide-y divide-amber-200 dark:divide-teal-800"
        >
          <thead class="bg-amber-100 dark:bg-teal-900">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                {{ $t("home.table.name") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                {{ $t("home.table.age") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden md:table-cell"
              >
                {{ $t("home.table.stake") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden lg:table-cell"
              >
                {{ $t("home.table.ward") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                {{ $t("home.table.group_company") }}
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-amber-50 dark:bg-teal-950 divide-y divide-amber-200 dark:divide-teal-800"
          >
            <tr
              v-for="participant in participants"
              :key="participant.id"
              class="hover:bg-amber-100 dark:hover:bg-teal-900 transition-colors cursor-pointer"
              @click="viewParticipant(participant.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-teal-900 dark:text-amber-100">
                  {{ participant.full_name }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200"
              >
                {{ participant.age }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden md:table-cell"
              >
                {{ participant.stake_or_district }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden lg:table-cell"
              >
                {{ participant.ward_or_branch }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200"
              >
                G: {{ participant.group }} / C: {{ participant.company }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click.stop="viewParticipant(participant.id)"
                  class="text-teal-700 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
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
        class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-teal-900 dark:text-amber-100">
              {{ $t("home.create_modal.title") }}
            </h2>
            <button
              @click="closeCreateModal"
              class="text-teal-700 hover:text-teal-900 dark:text-amber-200 dark:hover:text-amber-100 transition-colors"
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
import { ParticipantType } from "@/types/utlity";

const router = useRouter();
const participantsStore = useParticipantsStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => !!authStore.user);

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
const handleCreateSubmit = async (data: Partial<ParticipantType>) => {
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
