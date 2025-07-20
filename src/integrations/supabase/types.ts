export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      briefs: {
        Row: {
          companyLogo: string | null
          companyName: string
          createdAt: string | null
          hiringTrends: string | null
          id: string
          intelligenceSources: Json | null
          jobSignals: Json | null
          news: Json | null
          newsTrends: string | null
          outreachCopy: string | null
          pitchAngle: string
          signalTag: string
          stockData: Json | null
          subjectLine: string
          summary: string
          techStack: string[] | null
          techStackData: Json | null
          toneInsights: Json | null
          userId: string | null
          userIntent: string
          website: string | null
          whatNotToPitch: string
        }
        Insert: {
          companyLogo?: string | null
          companyName: string
          createdAt?: string | null
          hiringTrends?: string | null
          id?: string
          intelligenceSources?: Json | null
          jobSignals?: Json | null
          news?: Json | null
          newsTrends?: string | null
          outreachCopy?: string | null
          pitchAngle?: string
          signalTag?: string
          stockData?: Json | null
          subjectLine?: string
          summary?: string
          techStack?: string[] | null
          techStackData?: Json | null
          toneInsights?: Json | null
          userId?: string | null
          userIntent: string
          website?: string | null
          whatNotToPitch?: string
        }
        Update: {
          companyLogo?: string | null
          companyName?: string
          createdAt?: string | null
          hiringTrends?: string | null
          id?: string
          intelligenceSources?: Json | null
          jobSignals?: Json | null
          news?: Json | null
          newsTrends?: string | null
          outreachCopy?: string | null
          pitchAngle?: string
          signalTag?: string
          stockData?: Json | null
          subjectLine?: string
          summary?: string
          techStack?: string[] | null
          techStackData?: Json | null
          toneInsights?: Json | null
          userId?: string | null
          userIntent?: string
          website?: string | null
          whatNotToPitch?: string
        }
        Relationships: []
      }
      briefs_v2: {
        Row: {
          ai_brief: string | null
          company_data: Json | null
          company_name: string
          created_at: string
          data_sources_used: string[] | null
          generation_duration: number | null
          hiring_trends: Json | null
          id: string
          intent: string
          news_data: Json | null
          sentiment_data: Json | null
          stock_data: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_brief?: string | null
          company_data?: Json | null
          company_name: string
          created_at?: string
          data_sources_used?: string[] | null
          generation_duration?: number | null
          hiring_trends?: Json | null
          id?: string
          intent: string
          news_data?: Json | null
          sentiment_data?: Json | null
          stock_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_brief?: string | null
          company_data?: Json | null
          company_name?: string
          created_at?: string
          data_sources_used?: string[] | null
          generation_duration?: number | null
          hiring_trends?: Json | null
          id?: string
          intent?: string
          news_data?: Json | null
          sentiment_data?: Json | null
          stock_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          id: string
          page: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          page?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          page?: string | null
          type?: string
        }
        Relationships: []
      }
      outreach_sessions: {
        Row: {
          brief_id: string
          created_at: string
          id: string
          messages: Json
          session_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brief_id: string
          created_at?: string
          id?: string
          messages?: Json
          session_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brief_id?: string
          created_at?: string
          id?: string
          messages?: Json
          session_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_sessions_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_exists: {
        Args: { email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
