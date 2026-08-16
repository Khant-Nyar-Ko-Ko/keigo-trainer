// Hand-written to match supabase/migrations/0001_user_progress.sql and
// 0002_word_and_request_progress.sql. Small enough that this is simpler than
// pulling in the Supabase CLI to `gen types`.

type ModeStats = { correct: number; total: number };
type Stats = { drills: ModeStats; scenarios: ModeStats; words: ModeStats; requests: ModeStats };

export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          user_id: string;
          progress: Record<string, number>;
          scenario_progress: Record<string, number>;
          word_progress: Record<string, number>;
          request_progress: Record<string, number>;
          stats: Stats;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          progress?: Record<string, number>;
          scenario_progress?: Record<string, number>;
          word_progress?: Record<string, number>;
          request_progress?: Record<string, number>;
          stats?: Stats;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          progress?: Record<string, number>;
          scenario_progress?: Record<string, number>;
          word_progress?: Record<string, number>;
          request_progress?: Record<string, number>;
          stats?: Stats;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_progress: {
        Args: { p_key: string; p_delta: number };
        Returns: void;
      };
      increment_scenario_progress: {
        Args: { p_key: string; p_delta: number };
        Returns: void;
      };
      increment_word_progress: {
        Args: { p_key: string; p_delta: number };
        Returns: void;
      };
      increment_request_progress: {
        Args: { p_key: string; p_delta: number };
        Returns: void;
      };
      increment_stats: {
        Args: { p_mode: string; p_delta_correct: number; p_delta_total: number };
        Returns: void;
      };
    };
  };
}
