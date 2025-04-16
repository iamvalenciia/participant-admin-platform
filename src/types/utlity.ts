export interface ImportMeta {
  readonly env: Record<string, any>;
}

// Puedes colocar esta interfaz en un archivo como src/types/participant.ts

export interface ParticipantType {
  id: number;
  full_name: string;
  age: number;
  stake_or_district: string;
  ward_or_branch: string;
  group: number;
  company: number;
  shirt_size: string;
  medical_treatment: string;
  allergies: string;
  room: string;
  created_at?: string;
  updated_at?: string;
}
