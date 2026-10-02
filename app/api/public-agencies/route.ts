import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PublicAgency = Record<string, unknown>;

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function mapAgency(row: PublicAgency, sponsoredAgencyIds: Set<string>) {
  const city = typeof row.city === "string" ? row.city : "";
  const country = typeof row.country === "string" ? row.country : "";

  return {
    ...row,
    agencyId: row.id,
    id: row.slug ?? row.id,
    status: "approved",
    published: true,
    positioning: row.positioning_statement ?? row.positioning,
    description: row.about ?? row.positioning_statement ?? "",
    location: [city, country].filter(Boolean).join(", ") || country,
    services: list(row.services),
    niches: list(row.creator_niches ?? row.niches),
    countriesServed: list(row.regions_served ?? row.countries_served),
    verified: row.verification_status === "verified" || row.verified === true,
    sponsored: sponsoredAgencyIds.has(String(row.id)),
  };
}

export async function GET() {
  const supabase = await createClient();
  const [{ data, error }, { data: placements }] = await Promise.all([
    supabase.from("ap_public_agencies").select("*"),
    supabase.from("ap_sponsored_placements").select("agency_id").eq("status", "active").lte("starts_at", new Date().toISOString()).gt("ends_at", new Date().toISOString()),
  ]);

  if (error) {
    return NextResponse.json(
      { error: "The public agency directory is temporarily unavailable." },
      { status: 503 },
    );
  }

  const sponsoredAgencyIds = new Set((placements ?? []).map((item) => String(item.agency_id)));
  return NextResponse.json((data ?? []).map((row) => mapAgency(row as PublicAgency, sponsoredAgencyIds)), {
    headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
