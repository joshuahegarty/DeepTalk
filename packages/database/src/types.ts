// Auto-generated types placeholder
// Run `pnpm db:generate-types` to regenerate from your Supabase project
// Manually defined to match the migration until types are generated

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          slug: string;
          branding: Json;
          settings: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          slug: string;
          branding?: Json;
          settings?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          slug?: string;
          branding?: Json;
          settings?: Json;
          created_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          colour: string | null;
          settings: Json;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          colour?: string | null;
          settings?: Json;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          colour?: string | null;
          settings?: Json;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      user_workspaces: {
        Row: {
          user_id: string;
          workspace_id: string;
          role_id: string | null;
          department_ids: string[];
        };
        Insert: {
          user_id: string;
          workspace_id: string;
          role_id?: string | null;
          department_ids?: string[];
        };
        Update: {
          user_id?: string;
          workspace_id?: string;
          role_id?: string | null;
          department_ids?: string[];
        };
      };
      roles: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          permissions: Json;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          permissions?: Json;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          permissions?: Json;
        };
      };
      calls: {
        Row: {
          id: string;
          workspace_id: string;
          department_id: string | null;
          user_id: string | null;
          title: string | null;
          call_type: string | null;
          duration: number;
          status: string;
          audio_url: string | null;
          recording_state: string;
          sentiment: string | null;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          department_id?: string | null;
          user_id?: string | null;
          title?: string | null;
          call_type?: string | null;
          duration?: number;
          status?: string;
          audio_url?: string | null;
          recording_state?: string;
          sentiment?: string | null;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          department_id?: string | null;
          user_id?: string | null;
          title?: string | null;
          call_type?: string | null;
          duration?: number;
          status?: string;
          audio_url?: string | null;
          recording_state?: string;
          sentiment?: string | null;
          score?: number | null;
          created_at?: string;
        };
      };
      transcripts: {
        Row: {
          id: string;
          call_id: string;
          full_text: string | null;
          speaker_labels: Json;
          segments: Json;
        };
        Insert: {
          id?: string;
          call_id: string;
          full_text?: string | null;
          speaker_labels?: Json;
          segments?: Json;
        };
        Update: {
          id?: string;
          call_id?: string;
          full_text?: string | null;
          speaker_labels?: Json;
          segments?: Json;
        };
      };
      call_intelligence: {
        Row: {
          id: string;
          call_id: string;
          summary: string | null;
          action_items: Json;
          sentiment: string | null;
          score: number | null;
          topics: Json;
          talk_ratio: Json;
        };
        Insert: {
          id?: string;
          call_id: string;
          summary?: string | null;
          action_items?: Json;
          sentiment?: string | null;
          score?: number | null;
          topics?: Json;
          talk_ratio?: Json;
        };
        Update: {
          id?: string;
          call_id?: string;
          summary?: string | null;
          action_items?: Json;
          sentiment?: string | null;
          score?: number | null;
          topics?: Json;
          talk_ratio?: Json;
        };
      };
      knowledge_cards: {
        Row: {
          id: string;
          workspace_id: string;
          category: string | null;
          title: string;
          summary: string | null;
          content: Json;
          status: string;
          priority: string;
          confidence_threshold: number;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          category?: string | null;
          title: string;
          summary?: string | null;
          content?: Json;
          status?: string;
          priority?: string;
          confidence_threshold?: number;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          category?: string | null;
          title?: string;
          summary?: string | null;
          content?: Json;
          status?: string;
          priority?: string;
          confidence_threshold?: number;
        };
      };
      crm_sync_log: {
        Row: {
          id: string;
          call_id: string;
          crm_type: string;
          status: string;
          attempts: number;
          last_attempt: string | null;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          call_id: string;
          crm_type: string;
          status?: string;
          attempts?: number;
          last_attempt?: string | null;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          call_id?: string;
          crm_type?: string;
          status?: string;
          attempts?: number;
          last_attempt?: string | null;
          error_message?: string | null;
        };
      };
      coaching_events: {
        Row: {
          id: string;
          call_id: string;
          manager_id: string | null;
          type: string | null;
          content: string | null;
          timestamp_ref: number | null;
        };
        Insert: {
          id?: string;
          call_id: string;
          manager_id?: string | null;
          type?: string | null;
          content?: string | null;
          timestamp_ref?: number | null;
        };
        Update: {
          id?: string;
          call_id?: string;
          manager_id?: string | null;
          type?: string | null;
          content?: string | null;
          timestamp_ref?: number | null;
        };
      };
    };
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string };
        Returns: boolean;
      };
      user_workspace_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
    };
    Enums: Record<string, never>;
  };
}
