<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t("advancedSearch.title") }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t("advancedSearch.subtitle") }}
      </p>
    </div>

    <!-- Filtros de búsqueda -->
    <div
      class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6 p-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Filtro de Compañía -->
        <div>
          <label
            for="company"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ $t("advancedSearch.filters.company") }}
          </label>
          <select
            id="company"
            v-model="filters.company"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">
              {{ $t("advancedSearch.filters.all_companies") }}
            </option>
            <option
              v-for="company in companies"
              :key="company"
              :value="company"
            >
              {{
                $t("advancedSearch.filters.company_number", { number: company })
              }}
            </option>
          </select>
        </div>

        <!-- Filtro de Estaca -->
        <div>
          <label
            for="stake"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ $t("advancedSearch.filters.stake") }}
          </label>
          <select
            id="stake"
            v-model="filters.stake"
            @change="onStakeChange"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">
              {{ $t("advancedSearch.filters.all_stakes") }}
            </option>
            <option v-for="stake in stakeOptions" :key="stake" :value="stake">
              {{ stake }}
            </option>
          </select>
        </div>

        <!-- Filtro de Barrio -->
        <div>
          <label
            for="ward"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {{ $t("advancedSearch.filters.ward") }}
          </label>
          <select
            id="ward"
            v-model="filters.ward"
            :disabled="!filters.stake"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">
              {{ $t("advancedSearch.filters.all_wards") }}
            </option>
            <option v-for="ward in filteredWards" :key="ward" :value="ward">
              {{ ward }}
            </option>
          </select>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="clearFilters"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ $t("advancedSearch.filters.clear") }}
        </button>
        <button
          @click="searchParticipants"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {{ $t("advancedSearch.filters.search") }}
        </button>
      </div>
    </div>

    <!-- Tabla de resultados -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <!-- Loading indicator -->
      <div v-if="loading" class="p-6 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"
        ></div>
      </div>

      <!-- Error message -->
      <div v-else-if="error" class="p-6 text-center">
        <div
          class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
        >
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="participants.length === 0" class="p-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{
            searchPerformed
              ? $t("advancedSearch.no_results")
              : $t("advancedSearch.search_prompt")
          }}
        </p>
      </div>

      <!-- Results table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.name") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.age") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.stake") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.ward") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.group_company") }}
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">{{
                  $t("advancedSearch.table.actions")
                }}</span>
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
                  {{ $t("advancedSearch.table.view") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAdvancedSearchStore } from "@/stores/advancedSearch";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const router = useRouter();
const advancedSearchStore = useAdvancedSearchStore();
const authStore = useAuthStore();

// Datos estáticos para las compañías (del 1 al 24)
const companies = Array.from({ length: 24 }, (_, i) => i + 1);

// Datos para estacas y barrios (con el formato provisto)
const stakeWardMap = {
  "Esmeraldas Ecuador Stake": [
    "Aire Libre Ward",
    "Atacames Ward",
    "Eden Ward",
    "Forestal Ward",
    "Guayacana Ward",
    "Libertad Ward",
    "Los Jardines Ward",
    "Paraiso Ward",
    "Propicia Ward",
    "Quininde Ward",
    "Regocijo Ward",
    "Tolita Ward",
  ],
  "Quevedo Ecuador North Stake": [
    "Bellavista Ward",
    "Buena Fe Ward",
    "Buenaventura Ward",
    "La Mana Branch",
    "Nicolas Infante Ward",
    "Republica Ward",
    "Valencia Ward",
    "Venus del RÃ­o Ward",
  ],
  "Santo Domingo Ecuador Stake": [
    "Bomboli Ward",
    "El Bosque Ward",
    "El Carmen Ward",
    "La Concordia Ward",
    "Las Islas Ward",
    "Los Angeles Ward",
    "Los Laureles Ward",
    "Pedernales Branch",
    "Pedro Vicente Maldonado Branch",
  ],
};

// Options computed
const stakeOptions = computed(() => Object.keys(stakeWardMap));

// Estado local
const filters = ref({
  company: "",
  stake: "",
  ward: "",
});

const loading = ref(false);
const error = ref("");
const participants = ref<any[]>([]);
const searchPerformed = ref(false);

// Filtro de barrios basado en la estaca seleccionada
const filteredWards = computed(() => {
  if (!filters.value.stake) return [];
  return stakeWardMap[filters.value.stake] || [];
});

// Manejo de cambio de estaca
const onStakeChange = () => {
  // Si cambia la estaca, resetear el barrio seleccionado
  filters.value.ward = "";
};

// Limpiar todos los filtros
const clearFilters = () => {
  filters.value = {
    company: "",
    stake: "",
    ward: "",
  };
  if (searchPerformed.value) {
    searchParticipants();
  }
};

// Realizar la búsqueda
const searchParticipants = async () => {
  loading.value = true;
  error.value = "";
  searchPerformed.value = true;

  try {
    // Usa el nuevo store para la búsqueda avanzada
    const result = await advancedSearchStore.searchParticipants({
      company: filters.value.company,
      stake_or_district: filters.value.stake,
      ward_or_branch: filters.value.ward,
    });

    if (result.success) {
      participants.value = result.data || [];
    } else {
      error.value = result.error || t("advancedSearch.error_message");
      participants.value = [];
    }
  } catch (err) {
    console.error("Error searching participants:", err);
    error.value = t("advancedSearch.error_message");
    participants.value = [];
  } finally {
    loading.value = false;
  }
};

// Ver detalle de un participante
const viewParticipant = (id: number) => {
  router.push(`/participant/${id}`);
};

// Al montar el componente
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated()) {
    router.push("/login");
    return;
  }

  // Cargar los datos iniciales si hay filtros guardados
  if (advancedSearchStore.hasFilters) {
    filters.value = advancedSearchStore.lastFilters;
    await searchParticipants();
  }
});
</script>
