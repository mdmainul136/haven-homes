export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      development_projects: {
        Row: {
          actual_completion_date: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          expected_completion_date: string | null
          id: string
          images: string[] | null
          location: string
          location_bn: string | null
          name: string
          name_bn: string | null
          progress: number
          start_date: string | null
          status: string
          total_units: number | null
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          expected_completion_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          location_bn?: string | null
          name: string
          name_bn?: string | null
          progress?: number
          start_date?: string | null
          status?: string
          total_units?: number | null
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          expected_completion_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          location_bn?: string | null
          name?: string
          name_bn?: string | null
          progress?: number
          start_date?: string | null
          status?: string
          total_units?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          property_id: string
          status: string | null
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          property_id: string
          status?: string | null
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          project_id: string
          sort_order: number | null
          target_date: string | null
          title: string
          title_bn: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          project_id: string
          sort_order?: number | null
          target_date?: string | null
          title: string
          title_bn?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string
          sort_order?: number | null
          target_date?: string | null
          title?: string
          title_bn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "development_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          is_our_project: boolean | null
          listing_type: string
          location: string
          price: number
          property_type: string
          status: string | null
          title: string
          updated_at: string
          vendor_id: string
          views: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_our_project?: boolean | null
          listing_type?: string
          location: string
          price: number
          property_type: string
          status?: string | null
          title: string
          updated_at?: string
          vendor_id: string
          views?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_our_project?: boolean | null
          listing_type?: string
          location?: string
          price?: number
          property_type?: string
          status?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string
          views?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      valuation_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          last_notified_at: string | null
          location: string
          threshold_percentage: number
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_notified_at?: string | null
          location: string
          threshold_percentage?: number
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_notified_at?: string | null
          location?: string
          threshold_percentage?: number
          user_id?: string
        }
        Relationships: []
      }
      valuations: {
        Row: {
          age: number | null
          amenities: string[] | null
          area: number
          bathrooms: string | null
          bedrooms: string | null
          condition: string
          created_at: string
          estimated_value: number
          high_estimate: number
          id: string
          location: string
          low_estimate: number
          price_per_sqft: number
          property_type: string
          user_id: string
        }
        Insert: {
          age?: number | null
          amenities?: string[] | null
          area: number
          bathrooms?: string | null
          bedrooms?: string | null
          condition: string
          created_at?: string
          estimated_value: number
          high_estimate: number
          id?: string
          location: string
          low_estimate: number
          price_per_sqft: number
          property_type: string
          user_id: string
        }
        Update: {
          age?: number | null
          amenities?: string[] | null
          area?: number
          bathrooms?: string | null
          bedrooms?: string | null
          condition?: string
          created_at?: string
          estimated_value?: number
          high_estimate?: number
          id?: string
          location?: string
          low_estimate?: number
          price_per_sqft?: number
          property_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendor" | "user"
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
    Enums: {
      app_role: ["admin", "vendor", "user"],
    },
  },
} as const
