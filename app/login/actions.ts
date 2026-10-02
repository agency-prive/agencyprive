"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/agency/dashboard");
  const loginPath = String(formData.get("loginPath") ?? "/agency/login");
  const safeLoginPath = loginPath === "/owners/login" ? "/owners/login" : "/agency/login";
  const portalPrefix = safeLoginPath === "/owners/login" ? "/owners/" : "/agency/";
  const defaultNext = safeLoginPath === "/owners/login" ? "/owners/dashboard" : "/agency/dashboard";
  const safeNext = next.startsWith(portalPrefix) && !next.startsWith("//") ? next : defaultNext;
  if (!email || !password) redirect(`${safeLoginPath}?error=${encodeURIComponent("Enter your email address and password.")}`);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`${safeLoginPath}?error=${encodeURIComponent("Invalid email or password.")}`);

  if (safeLoginPath === "/owners/login") {
    const { data: staffRole } = await supabase
      .from("ap_staff_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "super_admin")
      .maybeSingle();

    if (!staffRole) {
      await supabase.auth.signOut();
      redirect(`/owners/login?error=${encodeURIComponent("This account is not authorized for the private owner portal.")}`);
    }
  }

  redirect(safeNext);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const agencyName = String(formData.get("agencyName") ?? "").trim();
  const requestedPlan = String(formData.get("plan") ?? "free").toLowerCase();
  const plan = ["free", "prive", "select", "elite"].includes(requestedPlan) ? requestedPlan : "free";
  if (!email || password.length < 8 || firstName.length < 1 || lastName.length < 1 || agencyName.length < 2) {
    redirect(`/agency/register?error=${encodeURIComponent("Complete every required field and use a password with at least 8 characters.")}`);
  }
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: { display_name: [firstName, lastName].filter(Boolean).join(" "), agency_name: agencyName, requested_plan: plan },
    },
  });
  if (error) redirect(`/agency/register?error=${encodeURIComponent(error.message)}`);
  redirect("/agency/login?message=Check your email to confirm your account.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/agency/login");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/owners/login");
}
