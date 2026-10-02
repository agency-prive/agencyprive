"use server";
import { redirect } from "next/navigation";
import { requireAgencyRole } from "@/lib/auth/authorization";
export async function startTrial(agencyId:string){const {supabase}=await requireAgencyRole(agencyId,["owner","admin","billing"]);const {error}=await supabase.rpc("ap_start_prive_trial",{target_agency:agencyId});if(error)redirect(`/agency/dashboard/agencies/${agencyId}/billing?error=${encodeURIComponent(error.message)}`);redirect(`/agency/dashboard/agencies/${agencyId}/billing?trial=1`)}
export async function requestPlan(agencyId:string,plan:string){const {supabase}=await requireAgencyRole(agencyId,["owner","admin","billing"]);const {error}=await supabase.rpc("ap_request_plan_change",{target_agency:agencyId,target_plan:plan});if(error)redirect(`/agency/dashboard/agencies/${agencyId}/billing?error=${encodeURIComponent(error.message)}`);redirect(`/agency/dashboard/agencies/${agencyId}/billing?requested=1`)}
