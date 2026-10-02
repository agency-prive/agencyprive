import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AgencyRole = "owner" | "admin" | "editor" | "analyst" | "billing";
export type StaffRole = "super_admin" | "moderator" | "verification_reviewer" | "support" | "finance";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/agency/login");
  return { supabase, user };
}

export async function requireAgencyRole(agencyId: string, allowed: AgencyRole[]) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("ap_agency_memberships")
    .select("role,status")
    .eq("agency_id", agencyId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (!data || !allowed.includes(data.role as AgencyRole)) redirect("/forbidden?portal=agency");
  return { supabase, user, role: data.role as AgencyRole };
}

export async function requireStaffRole(allowed: StaffRole[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/owners/login");
  const { data } = await supabase
    .from("ap_staff_roles")
    .select("role")
    .eq("user_id", user.id);

  const role = data?.map((item) => item.role as StaffRole).find((item) => allowed.includes(item));
  if (!role) redirect("/forbidden?portal=owner");
  return { supabase, user, role };
}
