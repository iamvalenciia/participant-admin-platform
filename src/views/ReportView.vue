<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-teal-900 dark:text-amber-100">
        {{ $t("report.title") || "Panel de Reportes" }}
      </h1>
      <p class="mt-2 text-teal-700 dark:text-amber-200">
        {{
          $t("report.subtitle") ||
          "Visualización de estadísticas y métricas del evento"
        }}
      </p>
    </div>

    <!-- Sección de carga y error -->
    <div v-if="loading" class="p-6 text-center mb-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-yellow-400"
      ></div>
      <p class="mt-2 text-teal-700 dark:text-amber-200">
        {{ $t("report.loading") || "Cargando datos..." }}
      </p>
    </div>

    <div v-else-if="error" class="p-6 text-center mb-8">
      <div
        class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md"
      >
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else>
      <!-- Tarjetas de estadísticas generales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Tarjeta: Total de participantes -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-2"
          >
            {{
              $t("report.cards.totalParticipants") || "Total de Participantes"
            }}
          </h3>
          <p class="text-3xl font-bold text-teal-600 dark:text-amber-300">
            {{ reportSummary?.totalParticipants || 0 }}
          </p>
        </div>

        <!-- Tarjeta: Check-in -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-2"
          >
            {{ $t("report.cards.checkedIn") || "Registrados (Check-in)" }}
          </h3>
          <p class="text-3xl font-bold text-teal-600 dark:text-amber-300">
            {{ reportSummary?.checkedIn || 0 }} /
            {{ reportSummary?.totalParticipants || 0 }}
          </p>
          <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              :style="`width: ${calculatePercentage(
                reportSummary?.checkedIn,
                reportSummary?.totalParticipants
              )}%`"
            ></div>
          </div>
        </div>

        <!-- Tarjeta: Asignación de camas -->
        <!-- Tarjeta: Participantes con Llegada Confirmada y Cama Asignada -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-2"
          >
            {{
              $t("report.cards.checkedInWithBeds") ||
              "Llegada Confirmada con Cama"
            }}
          </h3>
          <p class="text-3xl font-bold text-teal-600 dark:text-amber-300">
            {{ reportSummary?.checkedInWithBeds || 0 }} /
            {{ reportSummary?.checkedIn || 0 }}
          </p>
          <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              :style="`width: ${calculatePercentage(
                reportSummary?.checkedInWithBeds,
                reportSummary?.checkedIn
              )}%`"
            ></div>
          </div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {{
              calculatePercentage(
                reportSummary?.checkedInWithBeds,
                reportSummary?.checkedIn
              )
            }}% de participantes confirmados tienen cama
          </p>
        </div>

        <!-- Tarjeta: Entrega de teléfonos (actualizada para participantes con check-in) -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-2"
          >
            {{
              $t("report.cards.checkedInPhonesSubmitted") ||
              "Teléfonos Entregados (Registrados)"
            }}
          </h3>
          <p class="text-3xl font-bold text-teal-600 dark:text-amber-300">
            {{ reportSummary?.checkedInPhoneSubmitted || 0 }} /
            {{ reportSummary?.checkedIn || 0 }}
          </p>
          <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-yellow-500 h-2.5 rounded-full"
              :style="`width: ${calculatePercentage(
                reportSummary?.checkedInPhoneSubmitted,
                reportSummary?.checkedIn
              )}%`"
            ></div>
          </div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {{
              calculatePercentage(
                reportSummary?.checkedInPhoneSubmitted,
                reportSummary?.checkedIn
              )
            }}% de participantes confirmados entregaron teléfono
          </p>
        </div>
      </div>

      <!-- Gráficos principales - Primera fila -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico: Camas ocupadas vs disponibles -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-4"
          >
            {{ $t("report.charts.bedOccupancy") || "Ocupación de Camas" }}
          </h3>
          <div style="height: 250px; position: relative">
            <canvas ref="bedOccupancyChart"></canvas>
          </div>
        </div>

        <!-- Gráfico: Distribución por género -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-4"
          >
            {{
              $t("report.charts.genderDistribution") ||
              "Distribución por Género"
            }}
          </h3>
          <div style="height: 250px; position: relative">
            <canvas ref="genderChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Gráficos principales - Segunda fila -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico: Participantes por compañía -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-4"
          >
            {{
              $t("report.charts.checkedInByCompany") ||
              "Participantes por Compañía"
            }}
          </h3>
          <div style="height: 250px; position: relative">
            <canvas ref="companyChart"></canvas>
          </div>
        </div>

        <!-- Gráfico: Participación en actividades -->
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-4"
          >
            {{
              $t("report.charts.activitiesParticipation") ||
              "Participación en Actividades"
            }}
          </h3>
          <div style="height: 250px; position: relative">
            <canvas ref="activitiesChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Ocupación por edificio y piso -->
      <div class="mb-8">
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-4"
          >
            {{
              $t("report.charts.checkedInBuildingOccupancy") ||
              "Ocupación por Edificio y Piso"
            }}
          </h3>

          <div
            v-if="Object.keys(reportSummary?.byBuilding || {}).length === 0"
            class="text-center py-4"
          >
            <p class="text-teal-700 dark:text-amber-200">
              {{ $t("report.noData") || "No hay datos disponibles" }}
            </p>
          </div>

          <div v-else>
            <div style="height: 300px; position: relative">
              <canvas ref="buildingOccupancyChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Participantes sin cama asignada -->
      <div class="mb-8">
        <div
          class="bg-amber-50 dark:bg-teal-950 rounded-lg shadow-md p-6 border border-amber-200 dark:border-teal-800"
        >
          <h3
            class="text-lg font-semibold text-teal-800 dark:text-amber-100 mb-2"
          >
            {{
              $t("report.cards.participantsWithoutBeds") ||
              "Participantes sin Cama Asignada"
            }}
          </h3>
          <p class="text-3xl font-bold text-red-600 dark:text-red-400">
            {{ reportSummary?.withoutBeds || 0 }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useReportStore } from "@/stores/report";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Chart from "chart.js/auto";

const { t } = useI18n();
const router = useRouter();
const reportStore = useReportStore();
const authStore = useAuthStore();

// Referencias para los canvas de gráficos
const bedOccupancyChart = ref<HTMLCanvasElement | null>(null);
const genderChart = ref<HTMLCanvasElement | null>(null);
const companyChart = ref<HTMLCanvasElement | null>(null);
const activitiesChart = ref<HTMLCanvasElement | null>(null);
const buildingOccupancyChart = ref<HTMLCanvasElement | null>(null);

// Referencias a las instancias de Chart.js
const chartInstances = ref<Record<string, Chart>>({});

// Acceso directo a los datos del store
const loading = computed(() => reportStore.loading);
const error = computed(() => reportStore.error);
const reportSummary = computed(() => reportStore.reportSummary);

// Función auxiliar para calcular porcentajes
const calculatePercentage = (value?: number, total?: number) => {
  if (!value || !total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Función para crear/actualizar gráficos
const updateCharts = () => {
  if (!reportSummary.value) return;

  // Colores para gráficos
  const colors = {
    occupied: "rgba(54, 162, 235, 0.7)",
    available: "rgba(200, 200, 200, 0.7)",
    male: "rgba(54, 162, 235, 0.7)",
    female: "rgba(255, 99, 132, 0.7)",
    varietyShow: "rgba(54, 162, 235, 0.7)",
    musical: "rgba(153, 102, 255, 0.7)",
    phone: "rgba(255, 206, 86, 0.7)",
    checkedIn: "rgba(75, 192, 192, 0.7)",
    company: [
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 99, 132, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(201, 203, 207, 0.7)",
      "rgba(0, 162, 235, 0.7)",
      "rgba(255, 50, 132, 0.7)",
    ],
  };

  // Destruir gráficos existentes para evitar duplicados
  Object.values(chartInstances.value).forEach((chart) => chart.destroy());
  chartInstances.value = {};

  // 1. Gráfico de ocupación de camas
  // 1. Gráfico de ocupación de camas
  if (bedOccupancyChart.value) {
    // Obtener el número total de camas (sumando todas las camas de todos los edificios)
    const totalBeds = Object.values(
      reportSummary.value?.byBuilding || {}
    ).reduce((sum, building) => sum + building.total, 0);

    // Camas ocupadas (como lo estás calculando actualmente)
    const occupied = reportSummary.value?.withBeds || 0;

    // Camas disponibles (total - ocupadas)
    const available = totalBeds - occupied;

    chartInstances.value.bedOccupancy = new Chart(bedOccupancyChart.value, {
      type: "pie",
      data: {
        labels: [
          t("report.charts.occupiedBeds", "Camas Ocupadas"),
          t("report.charts.availableBeds", "Camas Disponibles"),
        ],
        datasets: [
          {
            data: [occupied, available],
            backgroundColor: [colors.occupied, colors.available],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw;
                const percentage = Math.round(
                  ((value as any) / totalBeds) * 100
                );
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  // 2. Gráfico de distribución por género
  if (genderChart.value && reportSummary.value.checkedInGenderDistribution) {
    const { male, female } = reportSummary.value.checkedInGenderDistribution;

    chartInstances.value.gender = new Chart(genderChart.value, {
      type: "pie",
      data: {
        labels: [
          t("report.charts.male", "Hombres"),
          t("report.charts.female", "Mujeres"),
        ],
        datasets: [
          {
            data: [male, female],
            backgroundColor: [colors.male, colors.female],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: t(
              "report.charts.checkedInOnly",
              "Solo participantes registrados"
            ),
            font: {
              size: 12,
            },
          },
        },
      },
    });
  }

  // 3. Gráfico de participantes por compañía (solo los que hicieron check-in)
  if (companyChart.value && reportSummary.value.byCompanyCheckedIn) {
    // Obtener las claves y ordenarlas numéricamente
    const companies = Object.keys(reportSummary.value.byCompanyCheckedIn)
      .map((c) => (isNaN(parseInt(c)) ? c : parseInt(c)))
      .sort((a, b) => {
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }
        if (typeof a === "number") return -1;
        if (typeof b === "number") return 1;
        return String(a).localeCompare(String(b));
      })
      .map((c) => c.toString());

    const counts = companies.map(
      (c) => reportSummary.value?.byCompanyCheckedIn[c] || 0
    );

    // Crear etiquetas personalizadas que incluyan el número de participantes
    const customLabels = companies.map((company, index) => {
      return `Compañía ${company} (${counts[index]})`;
    });

    chartInstances.value.company = new Chart(companyChart.value, {
      type: "pie",
      data: {
        labels: customLabels,
        datasets: [
          {
            data: counts,
            backgroundColor: colors.company,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: t("report.charts.checkedInOnly"),
          },
          legend: {
            display: true,
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value: any = context.raw;
                const total: any = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${value} participantes (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  // 4. Gráfico de participación en actividades
  if (activitiesChart.value) {
    const labels = [
      t("report.charts.checkedIn", "Check-in"),
      t("report.charts.varietyShow", "Show de Variedades"),
      t("report.charts.musicalProgram", "Programa Musical"),
      t("report.charts.phoneSubmission", "Entrega de Teléfono"),
    ];

    const confirmed = [
      reportSummary.value.checkedIn || 0,
      reportSummary.value.checkedInVarietyShowConfirmed || 0,
      reportSummary.value.checkedInMusicalProgramConfirmed || 0,
      reportSummary.value.checkedInPhoneSubmitted || 0,
    ];

    const pending = [
      reportSummary.value.pendingCheckIn || 0,
      reportSummary.value.checkedInVarietyShowPending || 0,
      reportSummary.value.checkedInMusicalProgramPending || 0,
      reportSummary.value.checkedInPhonePending || 0,
    ];

    chartInstances.value.activities = new Chart(activitiesChart.value, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: t("report.charts.confirmed", "Confirmados"),
            data: confirmed,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderWidth: 1,
          },
          {
            label: t("report.charts.pending", "Pendientes"),
            data: pending,
            backgroundColor: "rgba(255, 159, 64, 0.7)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: t(
              "report.charts.checkedInActivities",
              "Actividades de participantes registrados"
            ),
            font: {
              size: 12,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: t(
                "report.charts.numberOfParticipants",
                "Número de participantes"
              ),
            },
          },
          x: {
            stacked: true,
          },
        },
      },
    });
  }

  // 5. Gráfico de ocupación por edificio
  if (
    buildingOccupancyChart.value &&
    reportSummary.value.checkedInByBuilding &&
    reportSummary.value.byBuilding
  ) {
    const buildings = Object.keys(reportSummary.value.byBuilding).sort();

    // Para cada edificio, obtener camas ocupadas por participantes con check-in
    const occupied = buildings.map(
      (b) => reportSummary.value?.checkedInByBuilding[b]?.occupied || 0
    );

    // Camas disponibles (total - ocupadas por participantes con check-in)
    const available = buildings.map((b) => {
      const buildingData = reportSummary.value?.byBuilding[b];
      const occupiedWithCheckIn =
        reportSummary.value?.checkedInByBuilding[b]?.occupied || 0;
      return (buildingData?.total || 0) - occupiedWithCheckIn;
    });

    chartInstances.value.building = new Chart(buildingOccupancyChart.value, {
      type: "bar",
      data: {
        labels: buildings,
        datasets: [
          {
            label: t(
              "report.charts.checkedInOccupiedBeds",
              "Camas Ocupadas (Registrados)"
            ),
            data: occupied,
            backgroundColor: colors.occupied,
            borderWidth: 1,
          },
          {
            label: t("report.charts.availableBeds", "Camas Disponibles"),
            data: available,
            backgroundColor: colors.available,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            font: {
              size: 12,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: t("report.charts.numberOfBeds", "Número de camas"),
            },
          },
          x: {
            stacked: true,
            title: {
              display: true,
              text: t("report.charts.buildings", "Edificios"),
            },
          },
        },
      },
    });
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated()) {
    router.push("/login");
    return;
  }

  // Cargar datos para reportes
  try {
    await reportStore.fetchReportData();
    // Actualizar gráficos cuando los datos estén disponibles
    updateCharts();
  } catch (err) {
    console.error("Error al cargar datos para reportes:", err);
  }
});

// Actualizar gráficos cuando cambian los datos del reporte
watch(
  () => reportStore.reportSummary,
  () => {
    updateCharts();
  },
  { deep: true }
);
</script>

<style scoped>
/* Estilos adicionales específicos para la vista de reportes */
.table-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .table-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
