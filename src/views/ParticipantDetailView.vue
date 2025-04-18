<template>
  <div>
    <!-- Header section with back button and action buttons -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <button
          @click="goBack"
          class="inline-flex items-center text-sm font-medium text-teal-700 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
        >
          <svg
            class="mr-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t("participant_details.back_to_list") }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <!-- Edit button -->
        <div v-if="isAuthenticated">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
          >
            {{ $t("participant_details.edit_info") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="text-center p-12 bg-amber-50 dark:bg-teal-950 rounded-lg shadow"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-yellow-400"
      ></div>
      <p class="mt-4 text-teal-700 dark:text-amber-100">
        {{ $t("participant_details.loading") }}
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="p-6 text-center bg-amber-50 dark:bg-teal-950 rounded-lg shadow"
    >
      <div
        class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
      >
        <p>{{ error }}</p>
      </div>

      <button
        @click="loadParticipant"
        class="mt-4 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
      >
        {{ $t("participant_details.try_again") }}
      </button>
    </div>

    <!-- Participant details card -->
    <div
      v-else-if="participant"
      class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow overflow-hidden"
    >
      <!-- Card header with name -->
      <div class="px-6 py-5 border-b border-amber-200 dark:border-teal-800">
        <h2 class="text-2xl font-bold text-teal-900 dark:text-amber-100">
          {{ participant.full_name }}
        </h2>
      </div>

      <div class="p-6">
        <!-- Edit form -->
        <ParticipantForm
          v-if="isEditing"
          :participant="participant"
          :saving="saving"
          mode="edit"
          @submit="handleEditSubmit"
          @cancel="cancelEditing"
        ></ParticipantForm>

        <!-- View mode -->
        <div v-else>
          <!-- Personal information section -->
          <div class="mb-8">
            <div
              class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              <!-- Personal details -->
              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.full_name") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.full_name }}
                </div>
              </div>

              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.age") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.age }}
                </div>
              </div>

              <!-- Location information -->
              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.stake_or_district") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.stake_or_district }}
                </div>
              </div>

              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.ward_or_branch") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.ward_or_branch }}
                </div>
              </div>

              <!-- Group information -->
              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.group") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.group }}
                </div>
              </div>

              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.company") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.company }}
                </div>
              </div>
            </div>
          </div>

          <!-- Participation Status Section -->
          <div class="mb-8">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <!-- Check-in Status -->
              <div
                class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
              >
                <div class="mr-3 flex-shrink-0">
                  <div
                    v-if="participant.arrival_registered"
                    class="w-5 h-5 bg-teal-500 dark:bg-amber-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("participant_form.arrival_registered") }}
                  </div>
                  <div
                    class="text-xs text-gray-500 dark:text-gray-400"
                    v-if="participant.arrival_registered"
                  >
                    {{ $t("participant_form.status_confirmed") }}
                  </div>
                </div>
              </div>

              <!-- Variety Show Status -->
              <div
                class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
              >
                <div class="mr-3 flex-shrink-0">
                  <div
                    v-if="participant.variety_show"
                    class="w-5 h-5 bg-teal-500 dark:bg-amber-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("participant_form.variety_show") }}
                  </div>
                  <div
                    class="text-xs text-gray-500 dark:text-gray-400"
                    v-if="participant.variety_show"
                  >
                    {{ $t("participant_form.status_confirmed") }}
                  </div>
                </div>
              </div>

              <!-- Musical Program Status -->
              <div
                class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
              >
                <div class="mr-3 flex-shrink-0">
                  <div
                    v-if="participant.musical_program"
                    class="w-5 h-5 bg-teal-500 dark:bg-amber-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("participant_form.musical_program") }}
                  </div>
                  <div
                    class="text-xs text-gray-500 dark:text-gray-400"
                    v-if="participant.musical_program"
                  >
                    {{ $t("participant_form.status_confirmed") }}
                  </div>
                </div>
              </div>

              <!-- Phone delivered Status -->
              <div
                class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
              >
                <div class="mr-3 flex-shrink-0">
                  <div
                    v-if="participant.phone_submitted"
                    class="w-5 h-5 bg-teal-500 dark:bg-amber-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("participant_form.phone_submitted") }}
                  </div>
                  <div
                    class="text-xs text-gray-500 dark:text-gray-400"
                    v-if="participant.phone_submitted"
                  >
                    {{ $t("participant_form.status_confirmed") }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Health Information Section -->
          <div class="mb-8">
            <div class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.medical_treatment") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{ participant.medical_treatment || "Ninguno" }}
                </div>
              </div>

              <div>
                <div
                  class="text-sm font-medium text-teal-700 dark:text-amber-200"
                >
                  {{ $t("participant_form.allergies") }}
                </div>
                <div class="mt-1 text-teal-900 dark:text-amber-100">
                  {{
                    participant.allergies ||
                    $t("participant_details.no_allergies")
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Accommodation Information Section -->
          <div>
            <div
              v-if="!participant.unique_bed_key"
              class="p-4 bg-amber-100/50 dark:bg-teal-900/50 rounded-md border border-amber-200 dark:border-teal-800"
            >
              <div class="flex items-center text-teal-700 dark:text-amber-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{
                  t("bed_update.participant_form.no_bed_assigned")
                }}</span>
              </div>
            </div>

            <div
              v-else
              class="bg-white dark:bg-teal-950 rounded-md border border-amber-200 dark:border-teal-800 overflow-hidden"
            >
              <div
                class="bg-amber-100 dark:bg-teal-900 px-4 py-2 border-b border-amber-200 dark:border-teal-800"
              >
                <div
                  class="text-sm font-medium text-teal-800 dark:text-amber-100"
                >
                  {{ $t("participant_form.bed_information") }}
                </div>
              </div>
              <div
                class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-amber-200 dark:divide-teal-800"
              >
                <div class="p-3">
                  <div
                    class="text-xs uppercase tracking-wider text-teal-600 dark:text-amber-300 mb-1"
                  >
                    {{ $t("participant_form.building") }}
                  </div>
                  <div class="text-teal-900 dark:text-amber-100">
                    {{ participant.building || participant.unique_bed_key }}
                  </div>
                </div>
                <div class="p-3">
                  <div
                    class="text-xs uppercase tracking-wider text-teal-600 dark:text-amber-300 mb-1"
                  >
                    {{ $t("participant_form.floor") }}
                  </div>
                  <div class="text-teal-900 dark:text-amber-100">
                    {{ participant.floor || "-" }}
                  </div>
                </div>
                <div class="p-3">
                  <div
                    class="text-xs uppercase tracking-wider text-teal-600 dark:text-amber-300 mb-1"
                  >
                    {{ $t("participant_form.bed") }}
                  </div>
                  <div class="text-teal-900 dark:text-amber-100">
                    {{ participant.bed || "-" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="participant?.staff_created"
      @click="confirmDelete"
      class="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
    >
      {{ $t("participant_details.delete") }}
    </button>

    <div
      v-else
      class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow p-6 text-center"
    >
      <p class="text-teal-700 dark:text-amber-200">
        {{ $t("participant_details.not_found") }}
      </p>
    </div>
    <!-- Modal de confirmación para eliminar -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="p-6">
          <div class="text-center mb-6">
            <svg
              class="h-12 w-12 text-red-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <h3
              class="text-xl font-bold text-teal-900 dark:text-amber-100 mt-4"
            >
              {{ $t("participant_details.delete_modal.title") }}
            </h3>

            <p class="text-teal-700 dark:text-amber-200 mt-2">
              {{
                $t("participant_details.delete_modal.message", {
                  name: participant?.full_name,
                })
              }}
            </p>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-900 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm hover:bg-amber-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
            >
              {{ $t("participant_details.delete_modal.cancel") }}
            </button>

            <button
              @click="deleteParticipant"
              :disabled="deleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
            >
              {{
                deleting
                  ? $t("participant_details.delete_modal.deleting")
                  : $t("participant_details.delete_modal.confirm")
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ParticipantForm from "@/components/ParticipantForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useParticipantsStore } from "@/stores/participants";
import { useAuthStore } from "@/stores/auth";
import { ParticipantType } from "../types/utlity";
import { useBedsStore } from "@/stores/beds";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const participantsStore = useParticipantsStore();
const authStore = useAuthStore();

const userId = authStore.user?.id;

const participant = computed(() => participantsStore.currentParticipant);
const loading = computed(() => participantsStore.loading);
const error = computed(() => participantsStore.error);

const isEditing = ref(false);
// user is autheticated
const isAuthenticated = computed(() => !!authStore.user);
const saving = ref(false);
const editForm = ref<Partial<ParticipantType>>({});

const showDeleteModal = ref(false);
const deleting = ref(false);

const bedsStore = useBedsStore();
// Variables para el selector de camas
const showBedSelector = ref(false);
const loadingBeds = computed(() => bedsStore.loading);
const availableBeds = ref<any[]>([]);
const availableBuildings = computed(() => bedsStore.buildings);
const availableFloors = computed(() => {
  return bedFilters.value.building
    ? bedsStore.floors[bedFilters.value.building] || []
    : [];
});

// Filtros para la búsqueda de camas
const bedFilters = ref({
  building: "",
  floor: "",
});

// Agregar esta función en lugar de saveChanges
const handleEditSubmit = async (formData: ParticipantType) => {
  if (!participant.value) return;
  isEditing.value = false;

  saving.value = true;

  try {
    const prevBedKey = participant.value.unique_bed_key;
    const newBedKey = formData.unique_bed_key;
    const bedChanged = prevBedKey !== newBedKey;

    const dataToUpdate = Object.fromEntries(
      Object.entries(formData).filter(([key]) => !key.startsWith("_"))
    );

    const { success } = await participantsStore.updateParticipant(
      participant.value.id,
      dataToUpdate
    );

    if (success && bedChanged) {
      const participantId = participant.value.id;

      if (newBedKey) {
        await bedsStore.assignBed(participantId, newBedKey);
        const bedInfo = await bedsStore.fetchParticipantBed(participantId);
        bedInfo && participantsStore.updateCurrentParticipantBedInfo(bedInfo);
      } else if (prevBedKey) {
        await bedsStore.unassignBed(participantId);
      }
    }
  } finally {
    saving.value = false;
  }
};

// Función para cargar los datos del participante
const loadParticipant = async () => {
  const id = parseInt(route.params.id as string);

  if (isNaN(id)) {
    router.push("/");
    return;
  }

  await participantsStore.fetchParticipantById(id);

  // Si el participante tiene una cama asignada, cargar sus detalles
  if (participant.value?.unique_bed_key) {
    const bedInfo = await bedsStore.fetchParticipantBed(participant.value.id);

    // Actualizar el participante con la información detallada de la cama
    if (bedInfo) {
      participantsStore.updateCurrentParticipantBedInfo(bedInfo);
    }
  }
};

// Función para volver a la lista
const goBack = () => {
  router.push("/");
};

// Función para iniciar la edición
const startEditing = () => {
  if (!participant.value) return;

  // Clonar los datos para el formulario
  editForm.value = { ...participant.value };
  isEditing.value = true;
};

// Función para cancelar la edición
const cancelEditing = () => {
  isEditing.value = false;

  // Restablecer el formulario
  if (participant.value) {
    editForm.value = { ...participant.value };
  }
};

// Función para abrir el modal de confirmación de eliminación
const confirmDelete = () => {
  showDeleteModal.value = true;
};

// Función para cancelar la eliminación
const cancelDelete = () => {
  showDeleteModal.value = false;
};

// Función para eliminar el participante
const deleteParticipant = async () => {
  if (!participant.value) return;

  deleting.value = true;

  try {
    const result = await participantsStore.deleteParticipant(
      participant.value.id
    );

    if (result.success) {
      showDeleteModal.value = false;
      // Redirigir a la página principal después de eliminar
      router.push("/");
    }
  } finally {
    deleting.value = false;
  }
};

// Acciones al montar el componente
onMounted(async () => {
  await loadParticipant();
});
</script>
