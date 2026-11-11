/**
 * Averiq IMS - Supabase Database TypeScript Schema Definition
 * Generated for Phase 1 Multi-Tenant Architecture.
 * Reflects migrations 20261110000001 through 20261110000004.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserSystemRole = 'platform_admin' | 'standard_user';

export type InstituteRole =
  | 'institute_admin'
  | 'faculty'
  | 'staff'
  | 'student'
  | 'parent';

export type MembershipStatus =
  | 'active'
  | 'invited'
  | 'suspended'
  | 'archived';

export type InstituteType =
  | 'coaching'
  | 'school'
  | 'tuition'
  | 'junior_college'
  | 'college'
  | 'other';

export type OrganizationRole =
  | 'owner'
  | 'admin'
  | 'auditor'
  | 'member';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          billing_email: string | null;
          phone: string | null;
          address: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          billing_email?: string | null;
          phone?: string | null;
          address?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          billing_email?: string | null;
          phone?: string | null;
          address?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      institutes: {
        Row: {
          id: string;
          organization_id: string | null;
          code: string;
          name: string;
          slug: string;
          institute_type: InstituteType;
          board: string | null;
          subdomain: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          logo_url: string | null;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          code: string;
          name: string;
          slug: string;
          institute_type?: InstituteType;
          board?: string | null;
          subdomain?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          code?: string;
          name?: string;
          slug?: string;
          institute_type?: InstituteType;
          board?: string | null;
          subdomain?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          system_role: UserSystemRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          system_role?: UserSystemRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          system_role?: UserSystemRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      institute_memberships: {
        Row: {
          id: string;
          institute_id: string;
          user_id: string;
          role: InstituteRole;
          status: MembershipStatus;
          department: string | null;
          designation: string | null;
          custom_permissions: Json;
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institute_id: string;
          user_id: string;
          role: InstituteRole;
          status?: MembershipStatus;
          department?: string | null;
          designation?: string | null;
          custom_permissions?: Json;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institute_id?: string;
          user_id?: string;
          role?: InstituteRole;
          status?: MembershipStatus;
          department?: string | null;
          designation?: string | null;
          custom_permissions?: Json;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: OrganizationRole;
          status: MembershipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: OrganizationRole;
          status?: MembershipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: OrganizationRole;
          status?: MembershipStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_audit_logs: {
        Row: {
          id: string;
          action: string;
          target_user_id: string;
          performed_by: string;
          ip_address: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          target_user_id: string;
          performed_by: string;
          ip_address?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          target_user_id?: string;
          performed_by?: string;
          ip_address?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          institute_id: string;
          institute_role: InstituteRole;
          title: string | null;
          department: string | null;
        };
      };
    };
    Functions: {
      is_platform_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_institute_admin: {
        Args: { check_institute_id: string };
        Returns: boolean;
      };
      is_institute_staff_or_admin: {
        Args: { check_institute_id: string };
        Returns: boolean;
      };
      is_organization_admin: {
        Args: { check_org_id: string };
        Returns: boolean;
      };
      has_active_institute_membership: {
        Args: { check_institute_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_system_role: UserSystemRole;
      institute_role: InstituteRole;
      membership_status: MembershipStatus;
      institute_type: InstituteType;
      organization_role: OrganizationRole;
    };
  };
}
