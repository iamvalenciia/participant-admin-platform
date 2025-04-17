<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-teal-900 dark:text-amber-100">
        {{ $t("advancedSearch.title") }}
      </h1>
      <p class="mt-2 text-teal-700 dark:text-amber-200">
        {{ $t("advancedSearch.subtitle") }}
      </p>
    </div>

    <!-- Filtros de búsqueda -->
    <div
      class="bg-amber-50 dark:bg-teal-950 shadow-md rounded-lg overflow-hidden mb-6 p-6 border border-amber-200 dark:border-teal-800"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Filtro de Compañía -->
        <div>
          <label
            for="company"
            class="block text-sm font-medium text-teal-800 dark:text-amber-100 mb-1"
          >
            {{ $t("advancedSearch.filters.company") }}
          </label>
          <select
            id="company"
            v-model="filters.company"
            class="w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
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
            class="block text-sm font-medium text-teal-800 dark:text-amber-100 mb-1"
          >
            {{ $t("advancedSearch.filters.stake") }}
          </label>
          <select
            id="stake"
            v-model="filters.stake"
            @change="onStakeChange"
            class="w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
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
            class="block text-sm font-medium text-teal-800 dark:text-amber-100 mb-1"
          >
            {{ $t("advancedSearch.filters.ward") }}
          </label>
          <select
            id="ward"
            v-model="filters.ward"
            :disabled="!filters.stake"
            class="w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      <div class="mt-6 flex flex-wrap justify-end gap-3">
        <button
          @click="clearFilters"
          class="px-4 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm text-sm font-medium text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-900 hover:bg-amber-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
        >
          {{ $t("advancedSearch.filters.clear") }}
        </button>
        <button
          @click="searchParticipants"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
        >
          {{ $t("advancedSearch.filters.search") }}
        </button>
      </div>
    </div>

    <!-- Tabla de resultados -->
    <div
      class="bg-amber-50 dark:bg-teal-950 shadow-md rounded-lg overflow-hidden border border-amber-200 dark:border-teal-800"
    >
      <!-- Loading indicator -->
      <div v-if="loading" class="p-6 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-yellow-400"
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
        <p class="text-teal-700 dark:text-amber-200">
          {{
            searchPerformed
              ? $t("advancedSearch.no_results")
              : $t("advancedSearch.search_prompt")
          }}
        </p>
      </div>

      <!-- Results table -->
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
                {{ $t("advancedSearch.table.name") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.age") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden md:table-cell"
              >
                {{ $t("advancedSearch.table.stake") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden lg:table-cell"
              >
                {{ $t("advancedSearch.table.ward") }}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
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
            class="bg-white dark:bg-teal-950 divide-y divide-amber-200 dark:divide-teal-800"
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
    "Venus del Río Ward",
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
