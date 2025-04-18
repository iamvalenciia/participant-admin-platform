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
    <!-- Filtros de búsqueda -->
    <!-- Filtros de búsqueda mejorados -->
    <div
      class="bg-amber-50 dark:bg-teal-950 shadow-md rounded-lg overflow-hidden mb-6 border border-amber-200 dark:border-teal-800"
    >
      <!-- Título principal con tooltip de ayuda -->
      <div
        class="p-4 flex items-center justify-between border-b border-amber-200 dark:border-teal-800 bg-amber-100/50 dark:bg-teal-900/50"
      >
        <h3 class="text-sm font-medium text-teal-800 dark:text-amber-100">
          {{ $t("advancedSearch.filters.title") || "Filtros de búsqueda" }}
        </h3>

        <button
          class="text-teal-600 dark:text-amber-300 hover:text-teal-800 dark:hover:text-amber-100 transition-colors"
          @click="showFilterHelp = !showFilterHelp"
          aria-label="Mostrar ayuda de filtros"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Ayuda de filtros (aparece al hacer clic en el ícono de ayuda) -->
      <div
        v-if="showFilterHelp"
        class="p-4 bg-amber-100/30 dark:bg-teal-900/30 border-b border-amber-200 dark:border-teal-800"
      >
        <p class="text-xs text-teal-700 dark:text-amber-200 mb-2">
          {{
            $t("advancedSearch.filters.help_text") ||
            "Utiliza estos filtros para encontrar participantes específicos. Puedes combinar varios filtros para una búsqueda más precisa."
          }}
        </p>
        <ul
          class="list-disc pl-5 text-xs text-teal-700 dark:text-amber-200 space-y-1"
        >
          <li>
            {{
              $t("advancedSearch.filters.help_item1") ||
              "Filtra por compañía, estaca o barrio para encontrar grupos específicos."
            }}
          </li>
          <li>
            {{
              $t("advancedSearch.filters.help_item2") ||
              "Utiliza los filtros de estado para ver quiénes han completado ciertas actividades."
            }}
          </li>
          <li>
            {{
              $t("advancedSearch.filters.help_item3") ||
              "Haz clic en 'Buscar' para aplicar todos los filtros seleccionados."
            }}
          </li>
        </ul>
      </div>

      <!-- Filtros de ubicación y organización -->
      <div class="p-5 border-b border-amber-200 dark:border-teal-800">
        <h4
          class="text-xs uppercase font-medium text-teal-600 dark:text-amber-300 mb-4"
        >
          {{
            $t("advancedSearch.filters.location_section") ||
            "Ubicación y organización"
          }}
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Filtro de Compañía con ícono -->
          <div class="relative">
            <label
              for="company"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                />
              </svg>
              {{ $t("advancedSearch.filters.company") || "Compañía" }}
            </label>
            <select
              id="company"
              v-model="filters.company"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{
                  $t("advancedSearch.filters.all_companies") ||
                  "Todas las compañías"
                }}
              </option>
              <option
                v-for="company in companies"
                :key="company"
                :value="company"
              >
                {{
                  $t("advancedSearch.filters.company_number", {
                    number: company,
                  }) || `Compañía ${company}`
                }}
              </option>
            </select>
          </div>

          <!-- Filtro de Estaca con ícono -->
          <div class="relative">
            <label
              for="stake"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
              {{ $t("advancedSearch.filters.stake") || "Estaca" }}
            </label>
            <select
              id="stake"
              v-model="filters.stake"
              @change="onStakeChange"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{
                  $t("advancedSearch.filters.all_stakes") || "Todas las estacas"
                }}
              </option>
              <option v-for="stake in stakeOptions" :key="stake" :value="stake">
                {{ stake }}
              </option>
            </select>
          </div>

          <!-- Filtro de Barrio con ícono -->
          <div class="relative">
            <label
              for="ward"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                />
              </svg>
              {{ $t("advancedSearch.filters.ward") || "Barrio" }}
            </label>
            <select
              id="ward"
              v-model="filters.ward"
              :disabled="!filters.stake"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <option value="">
                {{
                  $t("advancedSearch.filters.all_wards") || "Todos los barrios"
                }}
              </option>
              <option v-for="ward in filteredWards" :key="ward" :value="ward">
                {{ ward }}
              </option>
            </select>
          </div>

          <!-- filtro de la cama -->
          <div class="relative">
            <label
              for="bed"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                />
              </svg>
              {{ $t("advancedSearch.filters.bed") || "Cama" }}
            </label>
            <select
              id="bed"
              v-model="filters.bed"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{
                  $t("advancedSearch.filters.any_status") || "Todas las camas"
                }}
              </option>
              <option value="assigned">
                {{
                  $t("advancedSearch.filters.bed_assigned") || "Cama asignada"
                }}
              </option>
              <option value="unassigned">
                {{
                  $t("advancedSearch.filters.bed_unassigned") ||
                  "Sin cama asignada"
                }}
              </option>
              <option
                v-if="availableBuildings && availableBuildings.length > 0"
                v-for="building in availableBuildings"
                :key="'bldg-' + building"
                :value="'building-' + building"
              >
                {{
                  $t("advancedSearch.filters.building_prefix") || "Edificio"
                }}:
                {{ building }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Filtros de estado de participación -->
      <div class="p-5 bg-amber-50/50 dark:bg-teal-950/50">
        <h4
          class="text-xs uppercase font-medium text-teal-600 dark:text-amber-300 mb-4"
        >
          {{
            $t("advancedSearch.filters.status_section") ||
            "Estado de participación"
          }}
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Filtro Check-in mejorado -->
          <div class="relative">
            <label
              for="arrival-registered"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <div
                class="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-green-500 dark:bg-green-500"
              ></div>
              {{
                $t("advancedSearch.filters.arrival_registered") ||
                "Check-in / Entrada"
              }}
            </label>
            <select
              id="arrival-registered"
              v-model="filters.arrivalRegistered"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{ $t("advancedSearch.filters.any_status") || "Todos" }}
              </option>
              <option value="true">
                {{ $t("advancedSearch.filters.checked_in") || "Registrado" }}
              </option>
              <option value="false">
                {{
                  $t("advancedSearch.filters.not_checked_in") || "No registrado"
                }}
              </option>
            </select>
          </div>

          <!-- Filtro Variety Show mejorado -->
          <div class="relative">
            <label
              for="variety-show"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <div
                class="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-500"
              ></div>
              {{
                $t("advancedSearch.filters.variety_show_label") ||
                "Show de variedades"
              }}
            </label>
            <select
              id="variety-show"
              v-model="filters.varietyShow"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{ $t("advancedSearch.filters.any_status") || "Todos" }}
              </option>
              <option value="true">
                {{
                  $t("advancedSearch.filters.variety_show_confirmed") ||
                  "Confirmado"
                }}
              </option>
              <option value="false">
                {{
                  $t("advancedSearch.filters.variety_show_pending") ||
                  "No confirmado"
                }}
              </option>
            </select>
          </div>

          <!-- Filtro Musical Program mejorado -->
          <div class="relative">
            <label
              for="musical-program"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <div
                class="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-purple-500 dark:bg-purple-500"
              ></div>
              {{
                $t("advancedSearch.filters.musical_program_label") ||
                "Programa musical"
              }}
            </label>
            <select
              id="musical-program"
              v-model="filters.musicalProgram"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{ $t("advancedSearch.filters.any_status") || "Todos" }}
              </option>
              <option value="true">
                {{
                  $t("advancedSearch.filters.musical_confirmed") || "Confirmado"
                }}
              </option>
              <option value="false">
                {{
                  $t("advancedSearch.filters.musical_pending") ||
                  "No confirmado"
                }}
              </option>
            </select>
          </div>

          <!-- Filtro Phone Submitted mejorado -->
          <div class="relative">
            <label
              for="phone-submitted"
              class="block text-xs font-medium text-teal-700 dark:text-amber-200 mb-1 flex items-center"
            >
              <div
                class="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-yellow-500 dark:bg-yellow-500"
              ></div>
              {{
                $t("advancedSearch.filters.phone_submitted_label") ||
                "Teléfono entregado"
              }}
            </label>
            <select
              id="phone-submitted"
              v-model="filters.phoneSubmitted"
              class="w-full px-3 py-2 text-sm border border-amber-300 dark:border-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-teal-900 text-teal-800 dark:text-amber-100 transition-colors"
            >
              <option value="">
                {{ $t("advancedSearch.filters.any_status") || "Todos" }}
              </option>
              <option value="true">
                {{
                  $t("advancedSearch.filters.phone_delivered") || "Entregado"
                }}
              </option>
              <option value="false">
                {{
                  $t("advancedSearch.filters.phone_not_delivered") ||
                  "No entregado"
                }}
              </option>
            </select>
          </div>
        </div>

        <!-- Opciones adicionales (checkbox de Staff) -->
        <div class="mt-4 flex items-center">
          <input
            id="staff-created"
            v-model="filters.staffCreated"
            type="checkbox"
            class="h-4 w-4 text-teal-600 focus:ring-yellow-500 border-amber-300 dark:border-teal-700 rounded"
          />
          <label
            for="staff-created"
            class="ml-2 block text-xs font-medium text-teal-700 dark:text-amber-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clip-rule="evenodd"
              />
            </svg>
            {{
              $t("advancedSearch.filters.staff_created") ||
              "Creado por personal del evento"
            }}
          </label>
        </div>

        <!-- Botones de acción -->
        <div class="mt-5 flex flex-wrap gap-3 justify-end items-center">
          <button
            @click="clearFilters"
            class="px-3 py-2 text-xs border border-amber-300 dark:border-teal-700 rounded-md shadow-sm font-medium text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-900 hover:bg-amber-100 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
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
            {{ $t("advancedSearch.filters.clear") || "Limpiar filtros" }}
          </button>

          <button
            @click="searchParticipants"
            class="px-3 py-2 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {{ $t("advancedSearch.filters.search") || "Buscar" }}
          </button>
        </div>
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
        <!-- La tabla optimizada para pequeñas pantallas -->
        <table class="w-full divide-y divide-amber-200 dark:divide-teal-800">
          <thead class="bg-amber-100 dark:bg-teal-900">
            <tr>
              <th
                scope="col"
                class="px-6 pr-0 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                {{ $t("advancedSearch.table.name") }}
              </th>
              <th
                scope="col"
                v-if="columnVisibility.age"
                class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden xs:table-cell"
              >
                {{ $t("advancedSearch.table.age") }}
              </th>
              <th
                scope="col"
                v-if="columnVisibility.stake"
                class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden md:table-cell"
              >
                {{ $t("advancedSearch.table.stake") }}
              </th>
              <th
                scope="col"
                v-if="columnVisibility.ward"
                class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden lg:table-cell"
              >
                {{ $t("advancedSearch.table.ward") }}
              </th>
              <th
                scope="col"
                v-if="columnVisibility.groupCompany"
                class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden sm:table-cell"
              >
                {{ $t("advancedSearch.table.group_company") }}
              </th>
              <th
                scope="col"
                v-if="columnVisibility.bed"
                class="px-4 py-3 text-left text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider hidden sm:table-cell"
              >
                {{ $t("advancedSearch.table.bed") }}
              </th>

              <!-- Estado columnas - visible en todos los tamaños pero optimizado -->
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                <span class="sr-only">{{
                  $t("advancedSearch.table.check_in") || "Check-in"
                }}</span>
                <span
                  class="tooltip"
                  data-tooltip="{{ $t('advancedSearch.table.check_in') || 'Check-in' }}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </th>

              <!-- Variety Show - siempre visible -->
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                <span class="sr-only">{{
                  $t("advancedSearch.table.variety_show") || "Show"
                }}</span>
                <span
                  class="tooltip"
                  data-tooltip="{{ $t('advancedSearch.table.variety_show') || 'Show de variedades' }}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </th>

              <!-- Musical Program - siempre visible -->
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                <span class="sr-only">{{
                  $t("advancedSearch.table.musical") || "Musical"
                }}</span>
                <span
                  class="tooltip"
                  data-tooltip="{{ $t('advancedSearch.table.musical') || 'Programa musical' }}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </span>
              </th>

              <!-- Phone Submitted - siempre visible -->
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs font-medium text-teal-700 dark:text-amber-200 uppercase tracking-wider"
              >
                <span class="sr-only">{{
                  $t("advancedSearch.table.phone") || "Teléfono"
                }}</span>
                <span
                  class="tooltip"
                  data-tooltip="{{ $t('advancedSearch.table.phone') || 'Teléfono entregado' }}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-teal-950 divide-y divide-amber-200 dark:divide-teal-800"
          >
            <tr
              v-for="participant in paginatedParticipants"
              :key="participant.id"
              class="hover:bg-amber-100 dark:hover:bg-teal-900 transition-colors cursor-pointer"
              @click="viewParticipant(participant.id)"
            >
              <!-- Nombre (siempre visible) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-teal-900 dark:text-amber-100">
                  {{ truncateName(participant.full_name) }}
                </div>
                <!-- Mostrar información adicional solo en tamaños pequeños -->
                <div
                  v-if="!columnVisibility.age || !columnVisibility.groupCompany"
                  class="text-xs text-teal-600 dark:text-amber-300 mt-1 sm:hidden"
                >
                  {{ participant.age }} años | G: {{ participant.group }} / C:
                  {{ participant.company }}
                </div>
              </td>

              <!-- Edad (opcional) -->
              <td
                v-if="columnVisibility.age"
                class="px-4 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden xs:table-cell"
              >
                {{ participant.age }}
              </td>

              <!-- Estaca (opcional) -->
              <td
                v-if="columnVisibility.stake"
                class="px-4 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden md:table-cell"
              >
                {{ truncateStake(participant.stake_or_district) }}
              </td>

              <!-- Barrio (opcional) -->
              <td
                v-if="columnVisibility.ward"
                class="px-4 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden lg:table-cell"
              >
                {{ cleanWardName(participant.ward_or_branch) }}
              </td>

              <!-- Grupo/Compañía (opcional) -->
              <td
                v-if="columnVisibility.groupCompany"
                class="px-4 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden sm:table-cell"
              >
                G: {{ participant.group }} / C: {{ participant.company }}
              </td>

              <!-- Cama (opcional) -->
              <td
                v-if="columnVisibility.bed"
                class="px-4 py-4 whitespace-nowrap text-teal-800 dark:text-amber-200 hidden sm:table-cell"
              >
                {{ participant.unique_bed_key || "-" }}
              </td>

              <!-- Estado check-in (siempre visible) -->
              <td class="px-2 py-4 whitespace-nowrap text-center">
                <span
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full"
                  :class="
                    participant.arrival_registered
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  "
                >
                  <span
                    class="h-4 w-4 rounded-full"
                    :class="
                      participant.arrival_registered
                        ? 'bg-green-500 dark:bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></span>
                </span>
              </td>

              <!-- Estado variety show (siempre visible) -->
              <td class="px-2 py-4 whitespace-nowrap text-center">
                <span
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full"
                  :class="
                    participant.variety_show
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  "
                >
                  <span
                    class="h-4 w-4 rounded-full"
                    :class="
                      participant.variety_show
                        ? 'bg-blue-500 dark:bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></span>
                </span>
              </td>

              <!-- Estado musical program (siempre visible) -->
              <td class="px-2 py-4 whitespace-nowrap text-center">
                <span
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full"
                  :class="
                    participant.musical_program
                      ? 'bg-purple-100 dark:bg-purple-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  "
                >
                  <span
                    class="h-4 w-4 rounded-full"
                    :class="
                      participant.musical_program
                        ? 'bg-purple-500 dark:bg-purple-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></span>
                </span>
              </td>

              <!-- Estado phone submitted (siempre visible) -->
              <td class="px-2 py-4 whitespace-nowrap text-center">
                <span
                  class="inline-flex items-center justify-center h-6 w-6 rounded-full"
                  :class="
                    participant.phone_submitted
                      ? 'bg-yellow-100 dark:bg-yellow-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  "
                >
                  <span
                    class="h-4 w-4 rounded-full"
                    :class="
                      participant.phone_submitted
                        ? 'bg-yellow-500 dark:bg-yellow-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Paginación -->
        <!-- SOLO la tabla en overflow-x-auto -->
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-amber-200 dark:divide-teal-800">
            <!-- Thead y tbody sin cambios -->
          </table>
        </div>

        <!-- Paginación FUERA del overflow para evitar problemas de scroll horizontal -->
        <div
          v-if="participants.length > 0"
          class="bg-amber-50 dark:bg-teal-950 px-4 py-3 border-t border-amber-200 dark:border-teal-800"
        >
          <!-- Paginación para pantallas medianas y grandes -->
          <div class="hidden sm:flex sm:items-center sm:justify-between">
            <!-- Información de paginación -->
            <div>
              <p class="text-sm text-teal-800 dark:text-amber-100">
                {{ $t("advancedSearch.pagination.showing") || "Mostrando" }}
                <span class="font-medium">{{
                  (currentPage - 1) * pageSize + 1
                }}</span>
                {{ $t("advancedSearch.pagination.to") || "a" }}
                <span class="font-medium">{{
                  Math.min(currentPage * pageSize, participants.length)
                }}</span>
                {{ $t("advancedSearch.pagination.of") || "de" }}
                <span class="font-medium">{{ participants.length }}</span>
                {{ $t("advancedSearch.pagination.results") || "resultados" }}
              </p>
            </div>

            <!-- Controles de paginación -->
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <!-- Botón Anterior -->
                <button
                  @click="goToPreviousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-300 dark:border-teal-700 bg-white dark:bg-teal-950 text-sm font-medium text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">{{
                    $t("advancedSearch.pagination.previous") || "Anterior"
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

                <!-- Números de página - SOLO PARA DESKTOP -->
                <template v-for="page in displayedPageNumbers" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      page === currentPage
                        ? 'z-10 bg-teal-50 dark:bg-teal-800 border-teal-500 dark:border-teal-600 text-teal-600 dark:text-teal-200'
                        : 'bg-white dark:bg-teal-950 border-amber-300 dark:border-teal-700 text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-amber-300 dark:border-teal-700 bg-white dark:bg-teal-950 text-sm font-medium text-teal-700 dark:text-amber-200"
                  >
                    ...
                  </span>
                </template>

                <!-- Botón Siguiente -->
                <button
                  @click="goToNextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-300 dark:border-teal-700 bg-white dark:bg-teal-950 text-sm font-medium text-teal-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">{{
                    $t("advancedSearch.pagination.next") || "Siguiente"
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

          <!-- Paginación móvil simplificada y optimizada - VISIBLE solo en MOBILE -->
          <div class="flex justify-between items-center sm:hidden">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="w-24 inline-flex justify-center items-center px-2 py-2 border border-amber-300 dark:border-teal-700 text-sm font-medium rounded-md text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-950 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
            >
              <svg
                class="h-5 w-5 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ $t("advancedSearch.pagination.previous_short") || "Anterior" }}
            </button>

            <div class="text-sm text-center text-teal-800 dark:text-amber-100">
              <span class="font-medium">{{ currentPage }}</span> /
              {{ totalPages }}
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="w-24 inline-flex justify-center items-center px-2 py-2 border border-amber-300 dark:border-teal-700 text-sm font-medium rounded-md text-teal-800 dark:text-amber-100 bg-white dark:bg-teal-950 hover:bg-amber-100 dark:hover:bg-teal-900 disabled:opacity-50 transition-colors"
            >
              {{ $t("advancedSearch.pagination.next_short") || "Siguiente" }}
              <svg
                class="h-5 w-5 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
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

// Estado para paginación
const currentPage = ref(1);
const pageSize = ref(10); // Número de registros por página
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Lista paginada de participantes
const paginatedParticipants = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return participants.value.slice(startIndex, endIndex);
});

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

const filters = ref({
  company: "",
  stake: "",
  ward: "",
  bed: "", // Nuevo filtro para camas
  staffCreated: false,
  arrivalRegistered: "",
  varietyShow: "",
  musicalProgram: "",
  phoneSubmitted: "",
});

// Función para truncar el nombre de la estaca
const truncateStake = (stake) => {
  if (!stake) return "-";

  const firstWord = stake.split(" ")[0];
  return firstWord + "...";
};

// Función para limpiar el nombre del barrio (quitar Ward/Branch)
const cleanWardName = (ward) => {
  if (!ward) return "-";

  // Elimina " Ward" o " Branch" del final del nombre
  return ward.replace(/ Ward$/, "").replace(/ Branch$/, "");
};

// Función para truncar el nombre completo a los dos primeros nombres
const truncateName = (name) => {
  if (!name) return "-";

  const nameParts = name.split(" ");

  // Si el nombre tiene más de dos palabras, mostrar solo las dos primeras y "..."
  if (nameParts.length > 2) {
    return `${nameParts[0]} ${nameParts[1]}...`;
  }

  // Si tiene dos o menos palabras, mostrar el nombre completo
  return name;
};

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

// Función para limpiar todos los filtros (actualizada)
const clearFilters = () => {
  filters.value = {
    company: "",
    stake: "",
    ward: "",
    bed: "", // No olvidar limpiar este también
    staffCreated: false,
    arrivalRegistered: "",
    varietyShow: "",
    musicalProgram: "",
    phoneSubmitted: "",
  };
};

// Ver detalle de un participante
const viewParticipant = (id: number) => {
  router.push(`/participant/${id}`);
};

// Computed para generar los números de página a mostrar
const displayedPageNumbers = computed(() => {
  const pages = [];
  const maxPageButtons = 5; // Cantidad máxima de botones numéricos a mostrar

  if (totalPages.value <= maxPageButtons) {
    // Si hay menos páginas que el máximo, mostrar todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Mostrar estratégicamente para que siempre se vea la primera, última y página actual
    // con puntos suspensivos como separadores
    if (currentPage.value <= 3) {
      // Cerca del inicio
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages.value);
    } else if (currentPage.value >= totalPages.value - 2) {
      // Cerca del final
      pages.push(1);
      pages.push("...");
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i);
      }
    } else {
      // En medio
      pages.push(1);
      pages.push("...");
      pages.push(currentPage.value - 1);
      pages.push(currentPage.value);
      pages.push(currentPage.value + 1);
      pages.push("...");
      pages.push(totalPages.value);
    }
  }

  return pages;
});

// Funciones de navegación
const goToPage = (page) => {
  currentPage.value = page;
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Realizar la búsqueda
// Realizar la búsqueda
const searchParticipants = async () => {
  loading.value = true;
  error.value = "";
  searchPerformed.value = true;

  // Restablecer a la primera página cuando se realiza una nueva búsqueda
  currentPage.value = 1;

  // Log para verificar qué valor está enviándose
  console.log("Filtro de cama:", filters.value.bed);

  try {
    // Usa el nuevo store para la búsqueda avanzada
    const result = await advancedSearchStore.searchParticipants({
      company: filters.value.company,
      stake_or_district: filters.value.stake,
      ward_or_branch: filters.value.ward,
      staff_created: filters.value.staffCreated,
      arrival_registered: filters.value.arrivalRegistered,
      variety_show: filters.value.varietyShow,
      musical_program: filters.value.musicalProgram,
      phone_submitted: filters.value.phoneSubmitted,
      bed: filters.value.bed, // Añadir el nuevo filtro de cama
    });

    if (result.success) {
      participants.value = result.data || [];
      totalItems.value = participants.value.length;
    } else {
      error.value = result.error || t("advancedSearch.error_message");
      participants.value = [];
      totalItems.value = 0;
    }
  } catch (err) {
    console.error("Error searching participants:", err);
    error.value = t("advancedSearch.error_message");
    participants.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// Añade este script a tu componente

// Estado para la visibilidad de columnas (solo para las opcionales)
const columnVisibility = ref({
  age: true, // Edad (xs+)
  stake: true, // Estaca (md+)
  ward: true, // Barrio (lg+)
  groupCompany: true, // Grupo/Compañía (sm+)
  bed: true, // Cama (sm+)
});

// Función para restablecer visibilidad por defecto
const resetColumnVisibility = () => {
  columnVisibility.value = {
    age: true,
    stake: true,
    ward: true,
    groupCompany: true,
    bed: true,
  };
};

// Guardar la configuración de columnas en localStorage
watch(
  columnVisibility,
  (newValue) => {
    localStorage.setItem("tableColumnPreferences", JSON.stringify(newValue));
  },
  { deep: true }
);

// Cargar preferencias al iniciar
onMounted(() => {
  const savedPreferences = localStorage.getItem("tableColumnPreferences");
  if (savedPreferences) {
    try {
      const preferences = JSON.parse(savedPreferences);
      columnVisibility.value = {
        ...columnVisibility.value,
        ...preferences,
      };
    } catch (e) {
      console.error("Error al cargar preferencias de columnas:", e);
    }
  }

  // Si la pantalla es pequeña, ajustar visibilidad por defecto (solo si no hay preferencias guardadas)
  if (!savedPreferences) {
    const width = window.innerWidth;
    if (width < 640) {
      // sm breakpoint
      columnVisibility.value.groupCompany = false;
      columnVisibility.value.bed = false;
      columnVisibility.value.stake = false;
      columnVisibility.value.ward = false;
    } else if (width < 768) {
      // md breakpoint
      columnVisibility.value.stake = false;
      columnVisibility.value.ward = false;
    } else if (width < 1024) {
      // lg breakpoint
      columnVisibility.value.ward = false;
    }
  }
});

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

<style scoped>
/* Definición del breakpoint extra small (xs) para pantallas >= 480px */
@media (min-width: 480px) {
  .xs\:table-cell {
    display: table-cell;
  }

  .xs\:hidden {
    display: none;
  }

  .xs\:block {
    display: block;
  }

  .xs\:flex {
    display: flex;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.6rem;
  pointer-events: none;
}
</style>
