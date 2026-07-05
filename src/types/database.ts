export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          owner_id: string
          ai_provider: "openai" | "anthropic" | null
          ai_api_key_encrypted: string | null
          plan: "free" | "pro" | "enterprise"
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>
      }
      organization_members: {
        Row: {
          id: string
          org_id: string
          user_id: string
          role: "owner" | "admin" | "editor" | "reviewer" | "viewer"
          invited_by: string | null
          joined_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["organization_members"]["Row"], "id" | "joined_at"> & {
          id?: string
          joined_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["organization_members"]["Insert"]>
      }
      help_centers: {
        Row: {
          id: string
          org_id: string
          name: string
          slug: string
          custom_domain: string | null
          description: string | null
          logo_url: string | null
          favicon_url: string | null
          primary_color: string
          custom_css: string | null
          default_locale: string
          is_public: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["help_centers"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["help_centers"]["Insert"]>
      }
      categories: {
        Row: {
          id: string
          help_center_id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>
      }
      sections: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["sections"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["sections"]["Insert"]>
      }
      articles: {
        Row: {
          id: string
          help_center_id: string
          section_id: string | null
          title: string
          slug: string
          content: Json
          content_text: string | null
          content_embedding: number[] | null
          status: "draft" | "in_review" | "approved" | "published" | "archived"
          locale: string
          sort_order: number
          seo_title: string | null
          seo_description: string | null
          expires_at: string | null
          assigned_reviewer_id: string | null
          view_count: number
          helpful_count: number
          not_helpful_count: number
          created_by: string
          last_edited_by: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["articles"]["Row"], "id" | "created_at" | "updated_at" | "view_count" | "helpful_count" | "not_helpful_count"> & {
          id?: string
          created_at?: string
          updated_at?: string
          view_count?: number
          helpful_count?: number
          not_helpful_count?: number
        }
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>
      }
      article_versions: {
        Row: {
          id: string
          article_id: string
          title: string
          content: Json
          content_text: string | null
          status: string
          edited_by: string
          change_summary: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["article_versions"]["Row"], "id" | "created_at"> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["article_versions"]["Insert"]>
      }
      article_feedback: {
        Row: {
          id: string
          article_id: string
          is_helpful: boolean
          comment: string | null
          visitor_fingerprint: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["article_feedback"]["Row"], "id" | "created_at"> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["article_feedback"]["Insert"]>
      }
      labels: {
        Row: {
          id: string
          org_id: string
          name: string
          color: string
        }
        Insert: Omit<Database["public"]["Tables"]["labels"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["labels"]["Insert"]>
      }
      article_labels: {
        Row: {
          article_id: string
          label_id: string
        }
        Insert: Database["public"]["Tables"]["article_labels"]["Row"]
        Update: Partial<Database["public"]["Tables"]["article_labels"]["Insert"]>
      }
      media_assets: {
        Row: {
          id: string
          org_id: string
          storage_path: string
          file_name: string
          mime_type: string
          size_bytes: number
          alt_text: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["media_assets"]["Row"], "id" | "created_at"> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]>
      }
      search_queries: {
        Row: {
          id: string
          help_center_id: string
          query: string
          result_count: number
          clicked_article_id: string | null
          session_id: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["search_queries"]["Row"], "id" | "created_at"> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["search_queries"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type OrganizationMember = Database["public"]["Tables"]["organization_members"]["Row"]
export type HelpCenter = Database["public"]["Tables"]["help_centers"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Section = Database["public"]["Tables"]["sections"]["Row"]
export type Article = Database["public"]["Tables"]["articles"]["Row"]
export type ArticleVersion = Database["public"]["Tables"]["article_versions"]["Row"]
export type ArticleFeedback = Database["public"]["Tables"]["article_feedback"]["Row"]
export type Label = Database["public"]["Tables"]["labels"]["Row"]
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"]
export type SearchQuery = Database["public"]["Tables"]["search_queries"]["Row"]

export type ArticleStatus = Article["status"]
export type MemberRole = OrganizationMember["role"]
