import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { requirePublicSupabaseEnv } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Keep old bookmarks working while making the role-specific URLs canonical.
  // Agency profile management and review submission belong to the agency portal;
  // every other legacy dashboard operation belongs to the owner portal.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname === "/admin/login"
      ? "/owners/login"
      : pathname === "/admin"
        ? "/owners/dashboard"
        : `/owners/dashboard${pathname.slice("/admin".length)}`;
    return NextResponse.redirect(destination, 308);
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const destination = request.nextUrl.clone();
    const agencyPath = pathname === "/dashboard"
      || pathname === "/dashboard/agencies"
      || pathname.startsWith("/dashboard/agencies/")
      || pathname === "/dashboard/reviews/new";
    destination.pathname = agencyPath
      ? `/agency${pathname}`
      : `/owners${pathname}`;
    return NextResponse.redirect(destination, 308);
  }

  let response = NextResponse.next({ request });
  const { url, key } = requirePublicSupabaseEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const isAdminRoute = request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/");
  const isOwnerRoute = request.nextUrl.pathname.startsWith("/owners/");
  const isAgencyRoute = request.nextUrl.pathname.startsWith("/agency/");
  const isProtectedAdminRoute = isAdminRoute && request.nextUrl.pathname !== "/admin/login";
  const isProtectedOwnerRoute = isOwnerRoute && request.nextUrl.pathname !== "/owners/login";
  const isProtectedAgencyRoute = isAgencyRoute && !["/agency/login", "/agency/register"].includes(request.nextUrl.pathname);
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  if (!user && (isDashboardRoute || isProtectedAdminRoute || isProtectedOwnerRoute || isProtectedAgencyRoute)) {
    const login = request.nextUrl.clone();
    login.pathname = isProtectedAdminRoute || isProtectedOwnerRoute ? "/owners/login" : "/agency/login";
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/agency/:path*", "/owners/:path*", "/login"] };
