export interface ImportMeta {
  readonly env: Record<string, any>;
}

// Actualización de la interfaz Database para incluir las nuevas tablas
export default interface Database {
  public: {
    Tables: {
      participants2: {
        Row: {
          id: number;
          full_name: string;
          age: number;
          stake_or_district: string;
          ward_or_branch: string;
          group: number;
          company: number;
          medical_treatment: string;
          allergies: string;
          building: string | null;
          floor: string | null;
          bed: number | null;
          gender: string;
          arrival_registered: boolean;
          variety_show: boolean;
          musical_program: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          age: number;
          stake_or_district: string;
          ward_or_branch: string;
          group: number;
          company: number;
          medical_treatment?: string;
          allergies?: string;
          building?: string | null;
          floor?: string | null;
          bed?: number | null;
          gender: string;
          arrival_registered: boolean;
          variety_show: boolean;
          musical_program: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          age?: number;
          stake_or_district?: string;
          ward_or_branch?: string;
          group?: number;
          company?: number;
          medical_treatment?: string;
          allergies?: string;
          building?: string | null;
          floor?: string | null;
          bed?: number | null;
          gender?: string;
          arrival_registered: boolean;
          variety_show: boolean;
          musical_program: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Nuevas tablas para la gestión de camas
      buildings: {
        Row: {
          building_id: number;
          building_name: string;
          description: string | null;
          capacity: number;
          is_active: boolean;
        };
      };
      floors: {
        Row: {
          floor_id: number;
          building_id: number;
          floor_code: string;
          description: string | null;
          capacity: number;
          is_active: boolean;
        };
      };
      beds: {
        Row: {
          bed_id: number;
          floor_id: number;
          bed_number: number;
          unique_bed_key: string;
          is_occupied: boolean;
          is_active: boolean;
        };
      };
      bed_assignments: {
        Row: {
          assignment_id: number;
          bed_id: number;
          participant_id: number;
          assigned_at: string;
          assigned_by: string | null;
          is_current: boolean;
        };
        Insert: {
          assignment_id?: number;
          bed_id: number;
          participant_id: number;
          assigned_at?: string;
          assigned_by?: string | null;
          is_current?: boolean;
        };
        Update: {
          assignment_id?: number;
          bed_id?: number;
          participant_id?: number;
          assigned_at?: string;
          assigned_by?: string | null;
          is_current?: boolean;
        };
      };
    };
    Views: {
      available_beds: {
        Row: {
          bed_id: number;
          unique_bed_key: string;
          building_name: string;
          floor_code: string;
          bed_number: number;
          building_id: number;
          floor_id: number;
          is_active: boolean;
          is_occupied: boolean;
        };
      };
      participant_beds: {
        Row: {
          participant_id: number;
          full_name: string;
          gender: string;
          age: number;
          stake_or_district: string;
          ward_or_branch: string;
          group: number;
          company: number;
          unique_bed_key: string | null;
          building_name: string | null;
          floor_code: string | null;
          bed_number: number | null;
          arrival_registered: boolean;
          variety_show: boolean;
          musical_program: boolean;
          assigned_at: string | null;
          assignment_id: number | null;
        };
      };
    };
    Functions: {
      search_available_beds: {
        Args: {
          p_building: string | null;
          p_floor: string | null;
          p_bed_number: number | null;
        };
        Returns: {
          bed_id: number;
          unique_bed_key: string;
          building_name: string;
          floor_code: string;
          bed_number: number;
        }[];
      };
    };
  };
}

// Interfaces para los tipos específicos
export interface ParticipantType {
  id: number;
  full_name: string;
  age: number;
  stake_or_district: string;
  ward_or_branch: string;
  group: number;
  company: number;
  medical_treatment: string | null;
  allergies: string | null;
  gender: string;
  building: string | null;
  floor: string | null;
  bed: number | null;
  unique_bed_key: string | null;
  bed_info?: BedAssignmentInfo | null;
  arrival_registered: boolean;
  variety_show: boolean;
  musical_program: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BedType {
  bed_id: number;
  unique_bed_key: string;
  building_name: string;
  floor_code: string;
  bed_number: number;
  is_occupied: boolean;
  is_active: boolean;
}

export interface BedAssignmentInfo {
  unique_bed_key: string;
  building_name: string;
  floor_code: string;
  bed_number: number;
  assigned_at?: string;
}
