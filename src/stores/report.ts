import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

interface ReportData {
  success: boolean;
  data?: any[];
  error?: string;
  summary?: {
    byCompanyCheckedIn: Record<string, number>;
    totalParticipants: number;
    withBeds: number;
    withoutBeds: number;
    checkedIn: number;
    pendingCheckIn: number;
    phonesSubmitted: number;
    phonesPending: number;
    varietyShowConfirmed: number;
    varietyShowPending: number;
    musicalProgramConfirmed: number;
    musicalProgramPending: number;
    checkedInWithBeds: number;
    // Nuevas propiedades para estadísticas basadas en participantes con check-in
    checkedInPhoneSubmitted: number;
    checkedInPhonePending: number;
    checkedInVarietyShowConfirmed: number;
    checkedInVarietyShowPending: number;
    checkedInMusicalProgramConfirmed: number;
    checkedInMusicalProgramPending: number;
    genderDistribution: {
      male: number;
      female: number;
    };
    // Distribución por género solo para participantes con check-in
    checkedInGenderDistribution: {
      male: number;
      female: number;
    };
    byCompany: Record<string, number>;
    byGroup: Record<string, number>;
    byBuilding: Record<
      string,
      {
        total: number;
        occupied: number;
        byFloor: Record<
          string,
          {
            total: number;
            occupied: number;
          }
        >;
      }
    >;
    // Ocupación de edificios solo para participantes con check-in
    checkedInByBuilding: Record<
      string,
      {
        occupied: number;
        byFloor: Record<
          string,
          {
            occupied: number;
          }
        >;
      }
    >;
  };
}

export const useReportStore = defineStore("report", () => {
  // Estado
  const loading = ref(false);
  const error = ref<string | null>(null);
  const participants = ref<any[]>([]);
  const reportSummary = ref<ReportData["summary"] | null>(null);

  /**
   * Obtiene los datos para los reportes
   */
  const fetchReportData = async (): Promise<ReportData> => {
    loading.value = true;
    error.value = null;

    try {
      // Consulta todos los participantes con todos los campos relevantes
      const { data, error: supabaseError } = await supabase
        .from("participants2")
        .select(
          "id, full_name, age, stake_or_district, ward_or_branch, group, company, building, floor, bed, gender, unique_bed_key, arrival_registered, variety_show, musical_program, phone_submitted, staff_created"
        );

      if (supabaseError) {
        console.error("Error de Supabase:", supabaseError);
        throw supabaseError;
      }

      participants.value = data || [];
      const totalParticipants = participants.value.length;

      // Calcular resumen de datos para los gráficos
      const summary = {
        totalParticipants,
        withBeds: 0,
        withoutBeds: 0,
        checkedIn: 0,
        pendingCheckIn: 0,
        phonesSubmitted: 0,
        phonesPending: 0,
        varietyShowConfirmed: 0,
        varietyShowPending: 0,
        musicalProgramConfirmed: 0,
        musicalProgramPending: 0,
        checkedInWithBeds: 0,
        // Inicializar nuevas propiedades
        checkedInPhoneSubmitted: 0,
        checkedInPhonePending: 0,
        checkedInVarietyShowConfirmed: 0,
        checkedInVarietyShowPending: 0,
        checkedInMusicalProgramConfirmed: 0,
        checkedInMusicalProgramPending: 0,
        genderDistribution: {
          male: 0,
          female: 0,
        },
        checkedInGenderDistribution: {
          male: 0,
          female: 0,
        },
        byCompany: {} as Record<string, number>,
        byCompanyCheckedIn: {} as Record<string, number>,
        byGroup: {} as Record<string, number>,
        byBuilding: {} as Record<
          string,
          {
            total: number;
            occupied: number;
            byFloor: Record<
              string,
              {
                total: number;
                occupied: number;
              }
            >;
          }
        >,
        checkedInByBuilding: {} as Record<
          string,
          {
            occupied: number;
            byFloor: Record<
              string,
              {
                occupied: number;
              }
            >;
          }
        >,
      };

      // Calcular estadísticas de camas
      const beds = await fetchAllBeds();

      // Mapa de camas ocupadas basado en los participantes que tienen unique_bed_key
      const occupiedBedKeys = new Set(
        participants.value
          .filter((p) => p.unique_bed_key)
          .map((p) => p.unique_bed_key)
      );

      // Crear un mapa de camas activas y ocupadas para búsqueda rápida
      // La clave es unique_bed_key y el valor es true si la cama está ocupada
      const activeBedKeysMap = new Map();
      beds.forEach((bed) => {
        if (bed.is_active) {
          activeBedKeysMap.set(bed.unique_bed_key, bed.is_occupied);
        }
      });

      // Inicializar estructuras de edificios/pisos
      const buildingStats: Record<
        string,
        {
          total: number;
          occupied: number;
          byFloor: Record<
            string,
            {
              total: number;
              occupied: number;
            }
          >;
        }
      > = {};

      // Inicializar estructuras para edificios/pisos solo para participantes con check-in
      const checkedInBuildingStats: Record<
        string,
        {
          occupied: number;
          byFloor: Record<
            string,
            {
              occupied: number;
            }
          >;
        }
      > = {};

      // Procesar datos de camas para estadísticas de edificios/pisos
      for (const bed of beds) {
        // Extraer información del unique_bed_key (formato: edificio_piso_numero)
        const parts = bed.unique_bed_key ? bed.unique_bed_key.split("_") : [];
        if (parts.length < 2) continue;

        const building = parts[0];
        const floor = parts[1];

        // Inicializar datos del edificio si no existe
        if (!buildingStats[building]) {
          buildingStats[building] = {
            total: 0,
            occupied: 0,
            byFloor: {},
          };
        }

        // Inicializar datos del piso si no existe
        if (!buildingStats[building].byFloor[floor]) {
          buildingStats[building].byFloor[floor] = {
            total: 0,
            occupied: 0,
          };
        }

        // Solo contar camas activas
        if (bed.is_active) {
          // Incrementar contadores totales
          buildingStats[building].total++;
          buildingStats[building].byFloor[floor].total++;

          // Verificar si la cama está ocupada según la columna is_occupied
          if (bed.is_occupied) {
            buildingStats[building].occupied++;
            buildingStats[building].byFloor[floor].occupied++;
          }
        }
      }

      summary.byBuilding = buildingStats;

      // Actualizar contadores de camas asignadas/sin asignar basado en is_occupied
      summary.withBeds = beds.filter(
        (bed) => bed.is_active && bed.is_occupied
      ).length;
      summary.withoutBeds = summary.totalParticipants - summary.withBeds;

      // Primero, filtrar los participantes que han confirmado llegada
      const participantsCheckedIn = participants.value.filter(
        (participant) => participant.arrival_registered
      );
      summary.checkedIn = participantsCheckedIn.length;
      summary.pendingCheckIn = summary.totalParticipants - summary.checkedIn;

      // Calular estadísticas basadas solo en participantes con check-in
      for (const participant of participantsCheckedIn) {
        // Teléfonos entregados
        if (participant.phone_submitted) {
          summary.checkedInPhoneSubmitted++;
        } else {
          summary.checkedInPhonePending++;
        }

        // Show de variedades
        if (participant.variety_show) {
          summary.checkedInVarietyShowConfirmed++;
        } else {
          summary.checkedInVarietyShowPending++;
        }

        // Programa musical
        if (participant.musical_program) {
          summary.checkedInMusicalProgramConfirmed++;
        } else {
          summary.checkedInMusicalProgramPending++;
        }

        // Distribución por género para participantes con check-in
        if (participant.gender === "Masculino") {
          summary.checkedInGenderDistribution.male++;
        } else if (participant.gender === "Femenino") {
          summary.checkedInGenderDistribution.female++;
        }

        // Si el participante tiene cama asignada, actualizar estadísticas de edificios para check-in
        if (
          participant.unique_bed_key &&
          activeBedKeysMap.get(participant.unique_bed_key)
        ) {
          // Extraer información del unique_bed_key (formato: edificio_piso_numero)
          const parts = participant.unique_bed_key.split("_");
          if (parts.length >= 2) {
            const building = parts[0];
            const floor = parts[1];

            // Inicializar datos del edificio si no existe
            if (!checkedInBuildingStats[building]) {
              checkedInBuildingStats[building] = {
                occupied: 0,
                byFloor: {},
              };
            }

            // Inicializar datos del piso si no existe
            if (!checkedInBuildingStats[building].byFloor[floor]) {
              checkedInBuildingStats[building].byFloor[floor] = {
                occupied: 0,
              };
            }

            // Incrementar contadores
            checkedInBuildingStats[building].occupied++;
            checkedInBuildingStats[building].byFloor[floor].occupied++;
          }
        }
      }

      // Asignar estadísticas de edificios para participantes con check-in
      summary.checkedInByBuilding = checkedInBuildingStats;

      // Luego, de esos participantes con llegada confirmada, contar cuántos tienen cama asignada
      const participantsCheckedInWithBeds = participantsCheckedIn.filter(
        (participant) =>
          participant.unique_bed_key &&
          activeBedKeysMap.has(participant.unique_bed_key) &&
          activeBedKeysMap.get(participant.unique_bed_key) === true
      );

      summary.checkedInWithBeds = participantsCheckedInWithBeds.length;

      // Analizar datos de todos los participantes para las estadísticas globales
      for (const participant of participants.value) {
        // Entrega de teléfono (estadística global)
        if (participant.phone_submitted) {
          summary.phonesSubmitted++;
        } else {
          summary.phonesPending++;
        }

        // Show de variedades (estadística global)
        if (participant.variety_show) {
          summary.varietyShowConfirmed++;
        } else {
          summary.varietyShowPending++;
        }

        // Programa musical (estadística global)
        if (participant.musical_program) {
          summary.musicalProgramConfirmed++;
        } else {
          summary.musicalProgramPending++;
        }

        // Distribución por género (estadística global)
        if (participant.gender === "Masculino") {
          summary.genderDistribution.male++;
        } else if (participant.gender === "Femenino") {
          summary.genderDistribution.female++;
        }

        // Agrupación por compañía (estadística global)
        const company = participant.company || "Sin asignar";
        summary.byCompany[company] = (summary.byCompany[company] || 0) + 1;

        // Agrupación por compañía solo de los que hicieron check-in
        if (participant.arrival_registered) {
          const company = participant.company || "Sin asignar";
          summary.byCompanyCheckedIn[company] =
            (summary.byCompanyCheckedIn[company] || 0) + 1;
        }

        // Agrupación por grupo (estadística global)
        const group = participant.group || "Sin asignar";
        summary.byGroup[group] = (summary.byGroup[group] || 0) + 1;
      }

      reportSummary.value = summary;

      return {
        success: true,
        data: participants.value,
        summary,
      };
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error("Error en la obtención de datos para reportes:", pgError);
      error.value = pgError.message || "Error al obtener datos para reportes";

      return {
        success: false,
        error: error.value,
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtiene todas las camas disponibles
   */
  const fetchAllBeds = async () => {
    try {
      const { data, error: bedsError } = await supabase
        .from("beds") // Asegúrate de que este es el nombre correcto de tu tabla
        .select(
          "bed_id, floor_id, bed_number, unique_bed_key, is_occupied, is_active"
        );

      if (bedsError) {
        throw bedsError;
      }

      return data || [];
    } catch (err) {
      console.error("Error al obtener camas:", err);
      return [];
    }
  };

  return {
    loading,
    error,
    participants,
    reportSummary,
    fetchReportData,
  };
});
