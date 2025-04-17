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
          {{ $t("participant_details.back_to_list") }}
        </button>
      </div>

      <!-- Botón de eliminar -->
      <button
        v-if="!isEditing && userId === 'ca544172-2460-4959-9c59-7d7e1ad57568'"
        @click="confirmDelete"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {{ $t("participant_details.delete") }}
      </button>

      <div v-if="isAuthenticated">
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ $t("participant_details.edit_info") }}
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
        {{ $t("participant_details.loading") }}
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
        {{ $t("participant_details.try_again") }}
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
                {{ $t("participant_form.full_name") }}
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
                {{ $t("participant_form.age") }}
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
                {{ $t("participant_form.stake_or_district") }}
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
                {{ $t("participant_form.ward_or_branch") }}
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
                {{ $t("participant_form.group") }}
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
                {{ $t("participant_form.company") }}
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
                for="room"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ $t("participant_form.bed") }}
              </label>
              <input
                id="room"
                v-model="editForm.room"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
              />
            </div>

            <!-- Sección de asignación de cama -->
            <div class="sm:col-span-2 mt-4">
              <div class="flex items-center justify-between mb-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {{ $t("participant_form.bed") }}
                </label>
                <button
                  type="button"
                  @click="toggleBedSelector"
                  class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  {{
                    showBedSelector
                      ? $t("bed_update.participant_form.hide_beds")
                      : $t("bed_update.participant_form.show_beds")
                  }}
                </button>
              </div>

              <div class="flex items-center mb-2">
                <div class="text-gray-900 dark:text-white font-medium">
                  {{ currentBedDisplay }}
                </div>
                <button
                  v-if="editForm.unique_bed_key"
                  type="button"
                  @click="unassignCurrentBed"
                  class="ml-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  {{ $t("bed_update.participant_form.unassign_bed") }}
                </button>
              </div>

              <!-- Selector de camas -->
              <div
                v-if="showBedSelector"
                class="mt-4 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
                @click.stop
              >
                <!-- Filtros -->
                <div
                  class="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-300 dark:border-gray-700"
                >
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        for="building-filter"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {{ $t("bed_update.bed_selector.building") }}
                      </label>
                      <select
                        id="building-filter"
                        v-model="bedFilters.building"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                      >
                        <option value="">
                          {{ $t("bed_update.bed_selector.all_buildings") }}
                        </option>
                        <option
                          v-for="building in availableBuildings"
                          :key="building"
                          :value="building"
                        >
                          {{ building }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        for="floor-filter"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {{ $t("bed_update.bed_selector.floor") }}
                      </label>
                      <select
                        id="floor-filter"
                        v-model="bedFilters.floor"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm"
                      >
                        <option value="">
                          {{ $t("bed_update.bed_selector.all_floors") }}
                        </option>
                        <option
                          v-for="floor in availableFloors"
                          :key="floor"
                          :value="floor"
                        >
                          {{ floor }}
                        </option>
                      </select>
                    </div>

                    <div class="flex items-end">
                      <button
                        type="button"
                        @click="searchBeds"
                        class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                        :disabled="loadingBeds"
                      >
                        {{ $t("bed_update.bed_selector.search") }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Tabla de resultados -->
                <div class="overflow-x-auto">
                  <table
                    class="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
                  >
                    <thead class="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {{ $t("bed_update.bed_selector.building") }}
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {{ $t("bed_update.bed_selector.floor") }}
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {{ $t("bed_update.bed_selector.bed_number") }}
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {{ $t("bed_update.bed_selector.actions") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr v-if="loadingBeds">
                        <td
                          colspan="4"
                          class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{ $t("bed_update.bed_selector.loading") }}
                        </td>
                      </tr>
                      <tr v-else-if="availableBeds.length === 0">
                        <td
                          colspan="4"
                          class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{ $t("bed_update.bed_selector.no_results") }}
                        </td>
                      </tr>
                      <tr
                        v-for="bed in paginatedBeds"
                        :key="bed.unique_bed_key"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {{ bed.building_name }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {{ bed.floor_code }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                        >
                          {{ bed.bed_number }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            @click="selectBed(bed)"
                            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                          >
                            {{ $t("bed_update.bed_selector.select") }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Paginación -->
                <div
                  class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
                >
                  <div class="flex-1 flex justify-between sm:hidden">
                    <button
                      @click.stop="prevPage"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      {{ $t("bed_update.pagination.previous") }}
                    </button>
                    <button
                      @click.stop="nextPage"
                      :disabled="currentPage >= totalPages"
                      class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      {{ $t("bed_update.pagination.next") }}
                    </button>
                  </div>
                  <div
                    class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
                  >
                    <div>
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {{ $t("bed_update.pagination.showing") }}
                        <span class="font-medium">{{ startItem }}</span>
                        {{ $t("bed_update.pagination.to") }}
                        <span class="font-medium">{{ endItem }}</span>
                        {{ $t("bed_update.pagination.of") }}
                        <span class="font-medium">{{
                          availableBeds.length
                        }}</span>
                        {{ $t("bed_update.pagination.results") }}
                      </p>
                    </div>
                    <div>
                      <nav
                        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          @click.stop="prevPage"
                          :disabled="currentPage === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span class="sr-only">{{
                            $t("bed_update.pagination.previous")
                          }}</span>
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          v-for="page in displayedPages"
                          :key="page"
                          @click="(event : any) => goToPage(page, event)"
                          :class="[
                            page === currentPage
                              ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                          ]"
                        >
                          {{ page }}
                        </button>
                        <button
                          @click.stop="nextPage"
                          :disabled="currentPage >= totalPages"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span class="sr-only">{{
                            $t("bed_update.pagination.next")
                          }}</span>
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label
                for="medical_treatment"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ $t("participant_form.medical_treatment") }}
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
                {{ $t("participant_form.allergies") }}
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
              {{ $t("participant_details.cancel") }}
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {{
                saving
                  ? $t("participant_details.saving")
                  : $t("participant_details.save_changes")
              }}
            </button>
          </div>
        </form>

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.full_name") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.full_name }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.age") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.age }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.stake_or_district") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.stake_or_district }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.ward_or_branch") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.ward_or_branch }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.group") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.group }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.company") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.company }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.bed") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.unique_bed_key || "No asignada" }}
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.medical_treatment") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{ participant.medical_treatment || "Ninguno" }}
            </div>
          </div>

          <div class="sm:col-span-2">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t("participant_form.allergies") }}
            </div>
            <div class="mt-1 text-gray-900 dark:text-white">
              {{
                participant.allergies || $t("participant_details.no_allergies")
              }}
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
        {{ $t("participant_details.not_found") }}
      </p>
    </div>
    <!-- Modal de confirmación para eliminar -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
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

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4">
              {{ $t("participant_details.delete_modal.title") }}
            </h3>

            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {{
                $t("participant_details.delete_modal.message", {
                  name: participant?.full_name,
                })
              }}
            </p>
          </div>

          <div class="flex justify-center space-x-4">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {{ $t("participant_details.delete_modal.cancel") }}
            </button>

            <button
              @click="deleteParticipant"
              :disabled="deleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
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
import { useRoute, useRouter } from "vue-router";
import { useParticipantsStore } from "@/stores/participants";
import { useAuthStore } from "@/stores/auth";
import { ParticipantType } from "../types/participant";
import { useBedsStore } from "@/stores/beds";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

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

// Paginación
const itemsPerPage = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(availableBeds.value.length / itemsPerPage)
);
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, availableBeds.value.length)
);
const paginatedBeds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return availableBeds.value.slice(start, end);
});
const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;

  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Computed para mostrar la cama actual
const currentBedDisplay = computed(() => {
  if (!editForm.value.unique_bed_key) {
    return t("bed_update.participant_form.no_bed_assigned");
  }

  // Si tenemos información detallada de la cama, la mostramos
  if (editForm.value.building && editForm.value.floor && editForm.value.bed) {
    return `${editForm.value.building}_${editForm.value.floor}_${editForm.value.bed}`;
  }

  // Si solo tenemos la clave, mostramos eso
  return editForm.value.unique_bed_key;
});

// Métodos para el selector de camas
const toggleBedSelector = async () => {
  showBedSelector.value = !showBedSelector.value;

  // Si se abre el selector, cargar los edificios, pisos y camas disponibles
  if (showBedSelector.value) {
    await bedsStore.loadBuildingsAndFloors();
    await searchBeds();
  }
};

const searchBeds = async () => {
  // Actualizar los filtros del store
  bedsStore.filters.building = bedFilters.value.building;
  bedsStore.filters.floor = bedFilters.value.floor;

  // Buscar camas disponibles
  await bedsStore.fetchAvailableBeds();

  // Actualizar la lista local
  availableBeds.value = bedsStore.availableBeds;

  // Reiniciar la paginación
  currentPage.value = 1;
};

const selectBed = (bed: any) => {
  // Actualizar el formulario con la cama seleccionada
  editForm.value.unique_bed_key = bed.unique_bed_key;
  editForm.value.building = bed.building_name;
  editForm.value.floor = bed.floor_code;
  editForm.value.bed = bed.bed_number;

  // Cerrar el selector
  showBedSelector.value = false;
};

const unassignCurrentBed = () => {
  // Eliminar la asignación de cama
  editForm.value.unique_bed_key = null;
  editForm.value.building = null;
  editForm.value.floor = null;
  editForm.value.bed = null;
};

const prevPage = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: any, event: any) => {
  event.preventDefault();
  event.stopPropagation();
  currentPage.value = page;
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

// Función para guardar los cambios
const saveChanges = async () => {
  isEditing.value = false;
  if (!participant.value || !editForm.value) return;

  saving.value = true;

  try {
    const prevBedKey = participant.value.unique_bed_key;
    const newBedKey = editForm.value.unique_bed_key;
    const bedChanged = prevBedKey !== newBedKey;

    const dataToUpdate = Object.fromEntries(
      Object.entries(editForm.value).filter(([key]) => !key.startsWith("_"))
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
