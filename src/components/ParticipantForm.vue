<template>
  <form @submit.prevent="submitForm">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label for="full_name" class="form-label">
          {{ $t("participant_form.full_name") }}
        </label>
        <input
          id="full_name"
          v-model="form.full_name"
          type="text"
          class="input"
        />
      </div>

      <div>
        <label for="age" class="form-label">
          {{ $t("participant_form.age") }}
        </label>
        <input
          id="age"
          v-model.number="form.age"
          type="number"
          required
          min="1"
          max="120"
          class="input"
        />
      </div>

      <div>
        <label for="stake_or_district" class="form-label">
          {{ $t("participant_form.stake_or_district") }}
        </label>
        <input
          id="stake_or_district"
          v-model="form.stake_or_district"
          type="text"
          required
          class="input"
        />
      </div>

      <div>
        <label for="ward_or_branch" class="form-label">
          {{ $t("participant_form.ward_or_branch") }}
        </label>
        <input
          id="ward_or_branch"
          v-model="form.ward_or_branch"
          type="text"
          required
          class="input"
        />
      </div>

      <div>
        <label for="group" class="form-label">
          {{ $t("participant_form.group") }}
        </label>
        <input
          id="group"
          v-model.number="form.group"
          type="number"
          required
          min="1"
          class="input"
        />
      </div>

      <div>
        <label for="company" class="form-label">
          {{ $t("participant_form.company") }}
        </label>
        <input
          id="company"
          v-model.number="form.company"
          type="number"
          required
          min="1"
          class="input"
        />
      </div>

      <div>
        <label for="room" class="form-label">
          {{ $t("participant_form.bed") }}
        </label>
        <input id="room" v-model="form.room" type="text" class="input" />
      </div>

      <div class="sm:col-span-2">
        <label for="medical_treatment" class="form-label">
          {{ $t("participant_form.medical_treatment") }}
        </label>
        <textarea
          id="medical_treatment"
          v-model="form.medical_treatment"
          rows="3"
          class="input"
        ></textarea>
      </div>

      <div class="sm:col-span-2">
        <label for="allergies" class="form-label">
          {{ $t("participant_form.allergies") }}
        </label>
        <textarea
          id="allergies"
          v-model="form.allergies"
          rows="3"
          class="input"
        ></textarea>
      </div>
    </div>

    <div class="mt-6 flex justify-end space-x-3">
      <button type="button" @click="cancelForm" class="btn btn-outline">
        {{ $t("participant_form.cancel") }}
      </button>
      <button type="submit" :disabled="saving" class="btn btn-primary">
        {{
          saving ? $t("participant_form.saving") : $t("participant_form.save")
        }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps, defineEmits, watch } from "vue";
import type { Participant } from "@/lib/supabase";

const props = defineProps<{
  participant?: Participant | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<Participant>];
  cancel: [];
}>();

// Formulario reactivo
const form = reactive<Partial<Participant>>({
  full_name: "",
  age: 0,
  stake_or_district: "",
  ward_or_branch: "",
  group: 0,
  company: 0,
  room: "",
  medical_treatment: "",
  allergies: "",
});

// Inicializar formulario con datos del participante
onMounted(() => {
  if (props.participant) {
    Object.assign(form, props.participant);
  }
});

// Observar cambios en el participante
watch(
  () => props.participant,
  (newParticipant) => {
    if (newParticipant) {
      Object.assign(form, newParticipant);
    }
  }
);

// Enviar formulario
const submitForm = () => {
  emit("submit", { ...form });
};

// Cancelar formulario
const cancelForm = () => {
  emit("cancel");
};
</script>
