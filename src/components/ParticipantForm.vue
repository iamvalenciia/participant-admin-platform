<template>
  <form @submit.prevent="submitForm">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="full_name"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.full_name") }}
        </label>
        <input
          id="full_name"
          v-model="form.full_name"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label
          for="age"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.age") }}
        </label>
        <input
          id="age"
          v-model.number="form.age"
          type="number"
          required
          min="1"
          max="120"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label
          for="stake_or_district"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.stake_or_district") }}
        </label>
        <select
          id="stake_or_district"
          v-model="form.stake_or_district"
          required
          @change="onStakeChange"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        >
          <option value="">{{ $t("participant_form.select_stake") }}</option>
          <option v-for="stake in stakeOptions" :key="stake" :value="stake">
            {{ stake }}
          </option>
        </select>
      </div>

      <div>
        <label
          for="ward_or_branch"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.ward_or_branch") }}
        </label>
        <select
          id="ward_or_branch"
          v-model="form.ward_or_branch"
          required
          :disabled="!form.stake_or_district"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{{ $t("participant_form.select_ward") }}</option>
          <option v-for="ward in filteredWards" :key="ward" :value="ward">
            {{ ward }}
          </option>
        </select>
      </div>

      <div>
        <label
          for="group"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.group") }}
        </label>
        <input
          id="group"
          v-model.number="form.group"
          type="number"
          required
          min="1"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label
          for="company"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.company") }}
        </label>
        <input
          id="company"
          v-model.number="form.company"
          type="number"
          required
          min="1"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <!-- Participation Status Section -->
      <div class="sm:col-span-2 mt-4 mb-6">
        <h3
          class="text-base font-semibold text-teal-800 dark:text-amber-100 mb-4"
        >
          {{
            $t("participant_form.participation_status") ||
            "Estado de Participación"
          }}
        </h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Check-in Status -->
          <div
            class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
          >
            <div class="mr-3 flex-shrink-0">
              <input
                id="arrival_registered"
                v-model="form.arrival_registered"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-yellow-500 border-amber-300 dark:border-teal-700 rounded"
              />
            </div>
            <label
              for="arrival_registered"
              class="text-sm font-medium text-teal-700 dark:text-amber-200"
            >
              {{ $t("participant_form.arrival_registered") }}
            </label>
          </div>

          <!-- Variety Show Status -->
          <div
            class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
          >
            <div class="mr-3 flex-shrink-0">
              <input
                id="variety_show"
                v-model="form.variety_show"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-yellow-500 border-amber-300 dark:border-teal-700 rounded"
              />
            </div>
            <label
              for="variety_show"
              class="text-sm font-medium text-teal-700 dark:text-amber-200"
            >
              {{ $t("participant_form.variety_show") }}
            </label>
          </div>

          <!-- Musical Program Status -->
          <div
            class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
          >
            <div class="mr-3 flex-shrink-0">
              <input
                id="musical_program"
                v-model="form.musical_program"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-yellow-500 border-amber-300 dark:border-teal-700 rounded"
              />
            </div>
            <label
              for="musical_program"
              class="text-sm font-medium text-teal-700 dark:text-amber-200"
            >
              {{ $t("participant_form.musical_program") }}
            </label>
          </div>
          <!-- Phone submitted Status -->
          <div
            class="bg-white dark:bg-teal-900/30 rounded-lg p-4 flex items-center border border-amber-200 dark:border-teal-800"
          >
            <div class="mr-3 flex-shrink-0">
              <input
                id="phone_submitted"
                v-model="form.phone_submitted"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-yellow-500 border-amber-300 dark:border-teal-700 rounded"
              />
            </div>
            <label
              for="phone_submitted"
              class="text-sm font-medium text-teal-700 dark:text-amber-200"
            >
              {{ $t("participant_form.phone_submitted") }}
            </label>
          </div>
        </div>
      </div>

      <div class="sm:col-span-2">
        <label
          for="medical_treatment"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.medical_treatment") }}
        </label>
        <input
          id="medical_treatment"
          v-model="form.medical_treatment"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <div class="sm:col-span-2">
        <label
          for="allergies"
          class="block text-sm font-medium text-teal-800 dark:text-amber-100"
        >
          {{ $t("participant_form.allergies") }}
        </label>
        <input
          id="allergies"
          v-model="form.allergies"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
        />
      </div>

      <!-- Sección de asignación de cama con selector -->
      <div
        class="sm:col-span-2 mt-6 bg-amber-50/40 dark:bg-teal-950/40 rounded-lg border border-amber-200 dark:border-teal-800 p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-teal-800 dark:text-amber-100">
            {{ $t("participant_form.bed_assignment") || "Asignación de Cama" }}
          </h3>
          <button
            type="button"
            @click="toggleBedSelector"
            class="inline-flex items-center px-3 py-1.5 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm text-sm font-medium text-teal-700 dark:text-amber-100 bg-white dark:bg-teal-900 hover:bg-amber-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="showBedSelector"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {{
              showBedSelector
                ? $t("bed_update.participant_form.hide_beds")
                : $t("bed_update.participant_form.show_beds")
            }}
          </button>
        </div>

        <div
          v-if="!form.unique_bed_key"
          class="mb-4 p-3 bg-amber-100/50 dark:bg-teal-900/50 rounded-md border border-amber-200 dark:border-teal-800 text-teal-700 dark:text-amber-200"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
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
            {{ t("bed_update.participant_form.no_bed_assigned") }}
          </div>
        </div>

        <div v-else class="mb-2">
          <div
            class="bg-amber-50 dark:bg-teal-900 rounded-md border border-amber-200 dark:border-teal-800 overflow-hidden"
          >
            <table
              class="min-w-full divide-y divide-amber-200 dark:divide-teal-800"
            >
              <!-- Reemplaza el encabezado de la tabla donde está el botón -->
              <thead class="bg-amber-100 dark:bg-teal-900">
                <tr>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase"
                  >
                    Edificio
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase"
                  >
                    Piso
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase"
                  >
                    Cama
                  </th>
                  <th class="px-4 py-2 text-right">
                    <button
                      type="button"
                      @click="unassignCurrentBed"
                      class="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 sm:mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span class="hidden sm:inline">{{
                        $t("bed_update.participant_form.unassign_bed")
                      }}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white dark:bg-teal-950">
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ form.building || "-" }}
                  </td>
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ form.floor || "-" }}
                  </td>
                  <td
                    class="px-4 py-2 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ form.bed || "-" }}
                  </td>
                  <td class="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Selector de camas -->
        <div
          v-if="showBedSelector"
          class="mt-4 border border-amber-300 dark:border-teal-700 rounded-lg overflow-hidden"
          @click.stop
        >
          <!-- Filtros -->
          <div
            class="bg-amber-100 dark:bg-teal-900 p-4 border-b border-amber-300 dark:border-teal-700"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  for="building-filter"
                  class="block text-sm font-medium text-teal-800 dark:text-amber-100"
                >
                  {{ $t("bed_update.bed_selector.building") }}
                </label>
                <select
                  id="building-filter"
                  v-model="bedFilters.building"
                  class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-800 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
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
                  class="block text-sm font-medium text-teal-800 dark:text-amber-100"
                >
                  {{ $t("bed_update.bed_selector.floor") }}
                </label>
                <select
                  id="floor-filter"
                  v-model="bedFilters.floor"
                  class="mt-1 block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-800 text-teal-800 dark:text-amber-100 sm:text-sm transition-colors"
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
                  class="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
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
              class="min-w-full divide-y divide-amber-300 dark:divide-teal-700"
            >
              <thead class="bg-amber-100 dark:bg-teal-900">
                <tr>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
                  >
                    {{ $t("bed_update.bed_selector.building") }}
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
                  >
                    {{ $t("bed_update.bed_selector.floor") }}
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
                  >
                    {{ $t("bed_update.bed_selector.bed_number") }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-teal-950 divide-y divide-amber-200 dark:divide-teal-800"
              >
                <tr v-if="loadingBeds">
                  <td
                    colspan="4"
                    class="px-6 py-4 text-center text-sm text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("bed_update.bed_selector.loading") }}
                  </td>
                </tr>
                <tr v-else-if="availableBeds.length === 0">
                  <td
                    colspan="4"
                    class="px-6 py-4 text-center text-sm text-teal-700 dark:text-amber-200"
                  >
                    {{ $t("bed_update.bed_selector.no_results") }}
                  </td>
                </tr>
                <tr
                  v-for="bed in paginatedBeds"
                  :key="bed.unique_bed_key"
                  @click="(event) => selectBed(bed, event)"
                  class="hover:bg-amber-200 dark:hover:bg-teal-800 transition-colors cursor-pointer"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ bed.building_name }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ bed.floor_code }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-teal-900 dark:text-amber-100"
                  >
                    {{ bed.bed_number }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div
            class="bg-amber-50 dark:bg-teal-950 px-4 py-3 flex items-center justify-between border-t border-amber-200 dark:border-teal-800 sm:px-6"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="(event) => prevPage(event)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-amber-300 dark:border-teal-700 text-sm font-medium rounded-md text-teal-800 dark:text-amber-100 bg-amber-50 dark:bg-teal-950 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
              >
                {{ $t("bed_update.pagination.previous") }}
              </button>
              <button
                @click="(event) => nextPage(event)"
                :disabled="currentPage >= totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-amber-300 dark:border-teal-700 text-sm font-medium rounded-md text-teal-800 dark:text-amber-100 bg-amber-50 dark:bg-teal-950 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
              >
                {{ $t("bed_update.pagination.next") }}
              </button>
            </div>
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-teal-800 dark:text-amber-100">
                  {{ $t("bed_update.pagination.showing") }}
                  <span class="font-medium">{{ startItem }}</span>
                  {{ $t("bed_update.pagination.to") }}
                  <span class="font-medium">{{ endItem }}</span>
                  {{ $t("bed_update.pagination.of") }}
                  <span class="font-medium">{{ availableBeds.length }}</span>
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
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-300 dark:border-teal-700 bg-amber-50 dark:bg-teal-950 text-sm font-medium text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
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
                    @click="(event) => goToPage(page, event)"
                    :class="[
                      page === currentPage
                        ? 'z-10 bg-yellow-50 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-600 text-yellow-600 dark:text-yellow-300'
                        : 'bg-amber-50 dark:bg-teal-950 border-amber-300 dark:border-teal-700 text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click.stop="nextPage"
                    :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-300 dark:border-teal-700 bg-amber-50 dark:bg-teal-950 text-sm font-medium text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
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
    </div>

    <div class="mt-6 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        @click="cancelForm"
        class="px-4 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-900 border border-amber-300 dark:border-teal-700 rounded-md shadow-sm hover:bg-amber-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
      >
        {{ $t("participant_form.cancel") }}
      </button>
      <button
        type="submit"
        :disabled="saving"
        class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
      >
        {{
          saving ? $t("participant_form.saving") : $t("participant_form.save")
        }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  onMounted,
  defineProps,
  defineEmits,
  watch,
} from "vue";
import { useBedsStore } from "@/stores/beds";
import { useI18n } from "vue-i18n";
import type { Participant } from "@/lib/supabase";

const props = defineProps<{
  participant?: Participant | null;
  saving?: boolean;
  mode?: "create" | "edit"; // Nuevo prop para determinar el modo
}>();

// Añade esto después de las importaciones en el script setup
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

// Computed para obtener las opciones de estacas
const stakeOptions = computed(() => Object.keys(stakeWardMap));

// Computed para obtener los barrios basados en la estaca seleccionada
const filteredWards = computed(() => {
  if (!form.stake_or_district) return [];
  return stakeWardMap[form.stake_or_district] || [];
});

// Función para manejar el cambio de estaca
const onStakeChange = () => {
  // Resetear el barrio seleccionado cuando cambia la estaca
  form.ward_or_branch = "";
};

const emit = defineEmits<{
  submit: [data: Partial<Participant>];
  cancel: [];
}>();

const { t } = useI18n();
const bedsStore = useBedsStore();

// Formulario reactivo
const form = reactive<Partial<Participant>>({
  full_name: "",
  age: 0,
  stake_or_district: "",
  ward_or_branch: "",
  group: 0,
  company: 0,
  medical_treatment: "",
  allergies: "",
  unique_bed_key: null,
  building: null,
  floor: null,
  bed: null,
});

// Variables para selector de camas
const showBedSelector = ref(false);
const loadingBeds = computed(() => bedsStore.loading);
const availableBeds = ref<any[]>([]);
const availableBuildings = computed(() => bedsStore.buildings);
const bedFilters = ref({
  building: "",
  floor: "",
});

// Obtener pisos disponibles basados en el edificio seleccionado
const availableFloors = computed(() => {
  return bedFilters.value.building
    ? bedsStore.floors[bedFilters.value.building] || []
    : [];
});

// Variables para paginación
const itemsPerPage = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(availableBeds.value.length / itemsPerPage)
);
const startItem = computed(() =>
  availableBeds.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage + 1
);
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
  if (!form.unique_bed_key) {
    return t("bed_update.participant_form.no_bed_assigned");
  }

  // Si tenemos información detallada de la cama, la mostramos
  if (form.building && form.floor && form.bed) {
    return `Edificio: ${form.building} - Piso: ${form.floor} - Número: ${form.bed}`;
  }

  // Si solo tenemos la clave, mostramos eso
  return form.unique_bed_key;
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

const selectBed = (bed: any, event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Actualizar el formulario con la cama seleccionada
  form.unique_bed_key = bed.unique_bed_key;
  form.building = bed.building_name;
  form.floor = bed.floor_code;
  form.bed = bed.bed_number;

  // Cerrar el selector
  showBedSelector.value = false;
};

const unassignCurrentBed = () => {
  // Eliminar la asignación de cama
  form.unique_bed_key = null;
  form.building = null;
  form.floor = null;
  form.bed = null;
};

const prevPage = (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number, event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  currentPage.value = page;
};

// Enviar formulario
const submitForm = () => {
  emit("submit", { ...form });
};

// Cancelar formulario
const cancelForm = () => {
  emit("cancel");
};
</script>
