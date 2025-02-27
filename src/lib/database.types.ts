export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          image: string | null
          created_at: string
          auth_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          image?: string | null
          created_at?: string
          auth_id: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          image?: string | null
          created_at?: string
          auth_id?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          goal: number
          current_amount: number
          created_at: string
          deadline: string
          image: string | null
          created_by: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          goal: number
          current_amount?: number
          created_at?: string
          deadline: string
          image?: string | null
          created_by: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          goal?: number
          current_amount?: number
          created_at?: string
          deadline?: string
          image?: string | null
          created_by?: string
          is_active?: boolean
        }
      }
      donations: {
        Row: {
          id: string
          campaign_id: string
          amount: number
          donor_name: string
          donor_email: string
          message: string | null
          created_at: string
          is_anonymous: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          campaign_id: string
          amount: number
          donor_name: string
          donor_email: string
          message?: string | null
          created_at?: string
          is_anonymous?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string
          amount?: number
          donor_name?: string
          donor_email?: string
          message?: string | null
          created_at?: string
          is_anonymous?: boolean
          user_id?: string | null
        }
      }
      campaign_suggestions: {
        Row: {
          id: string
          campaign_id: string
          title: string
          description: string
          type: 'content' | 'promotion' | 'audience'
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          description: string
          type: 'content' | 'promotion' | 'audience'
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          description?: string
          type?: 'content' | 'promotion' | 'audience'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      suggestion_type: 'content' | 'promotion' | 'audience'
    }
  }
} 