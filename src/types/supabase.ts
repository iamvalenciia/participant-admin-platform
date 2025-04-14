export default interface Database {
  public: {
    Tables: {
      participants: {
        Row: {
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
        };
        Insert: {
          id?: number;
          full_name: string;
          age: number;
          stake_or_district: string;
          ward_or_branch: string;
          group: number;
          company: number;
          shirt_size?: string;
          medical_treatment?: string;
          allergies?: string;
          room?: string;
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
          shirt_size?: string;
          medical_treatment?: string;
          allergies?: string;
          room?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
