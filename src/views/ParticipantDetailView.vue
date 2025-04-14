<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <button
          @click="goBack"
          class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
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
          Volver a la lista
        </button>
      </div>

      <div v-if="participant">
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Editar información
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"
      ></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">
        Cargando información del participante...
      </p>
    </div>

    <div
      v-else-if="error"
      class="p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <div
        class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
      >
        <p>{{ error }}</p>
      </div>

      <button
        @click="loadParticipant"
        class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Intentar nuevamente
      </button>
    </div>

    <div
      v-else-if="participant"
      class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
    >
      <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ participant.full_name }}
        </h2>
      </div>

      <div class="p-6">
        <form v-if="isEditing" @submit.prevent="saveChanges">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                for="full_name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre completo
              </label>
              <input
                id="full_name"
                v-model="editForm.full_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>

            <div>
              <label
                for="age"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Edad
              </label>
              <input
                id="age"
                v-model.number="editForm.age"
                type="number"
                required
                min="1"
                max="120"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>

            <div>
              <label
                for="stake_or_district"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Estaca/Distrito
              </label>
              <input
                id="stake_or_district"
                v-model="editForm.stake_or_district"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>

            <div>
              <label
                for="ward_or_branch"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Barrio/Rama
              </label>
              <input
                id="ward_or_branch"
                v-model="editForm.ward_or_branch"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>

            <div>
              <label
                for="group"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Grupo
              </label>
              <input
                id="group"
                v-model.number="editForm.group"
                type="number"
                required
                min="1"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label
                for="company"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Compañía
              </label>
              <input
                id="company"
                v-model.number="editForm.company"
                type="number"
                required
                min="1"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label
                for="shirt_size"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Talla de camiseta
              </label>
              <select
                id="shirt_size"
                v-model="editForm.shirt_size"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm rounded-md"
              >
                <option value="">Sin especificar</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label
                for="room"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Habitación
              </label>
              <input
                id="room"
                v-model="editForm.room"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              />
            </div>

            <div class="sm:col-span-2">
              <label
                for="medical_treatment"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tratamiento médico
              </label>
              <textarea
                id="medical_treatment"
                v-model="editForm.medical_treatment"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              ></textarea>
            </div>

            <div class="sm:col-span-2">
              <label
                for="allergies"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Alergias
              </label>
              <textarea
                id="allergies"
                v-model="editForm.allergies"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="cancelEditing"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {{ saving ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </form>

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nombre completo
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.full_name }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Edad
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.age }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Estaca/Distrito
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.stake_or_district }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Barrio/Rama
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.ward_or_branch }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Grupo
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.group }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Compañía
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.company }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Talla de camiseta
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.shirt_size || "No especificado" }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Habitación
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.room || "No asignada" }}
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tratamiento médico
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.medical_treatment || "Ninguno" }}
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Alergias
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.allergies || "Ninguna" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400">
        No se encontró información del participante.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useParticipantsStore } from "@/stores/participants";
import { useAuthStore } from "@/stores/auth";
import type { Participant } from "@/lib/supabase";

const route = useRoute();
const router = useRouter();
const participantsStore = useParticipantsStore();
const authStore = useAuthStore();

const participant = computed(() => participantsStore.currentParticipant);
const loading = computed(() => participantsStore.loading);
const error = computed(() => participantsStore.error);

const isEditing = ref(false);
const saving = ref(false);
const editForm = ref<Partial<Participant>>({});

// Función para cargar los datos del participante
const loadParticipant = async () => {
  const id = parseInt(route.params.id as string);

  if (isNaN(id)) {
    router.push("/");
    return;
  }

  await participantsStore.fetchParticipantById(id);
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

// Función para guardar los cambios
const saveChanges = async () => {
  if (!participant.value || !editForm.value) return;

  saving.value = true;

  try {
    const result = await participantsStore.updateParticipant(
      participant.value.id,
      editForm.value
    );

    if (result.success) {
      isEditing.value = false;
    }
  } finally {
    saving.value = false;
  }
};

// Acciones al montar el componente
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated()) {
    router.push("/login");
    return;
  }

  await loadParticipant();
});
</script>
