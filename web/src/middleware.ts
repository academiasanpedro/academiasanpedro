// Middleware — Protección de rutas
// Ref: AcademiaSanPedro/02_Architecture/02_Frontend_Routes.md → Middleware de Protección
// Rutas /dashboard/* requieren sesión. Rutas /auth/* redirigen si ya hay sesión.

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({ request });
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Si no hay sesión y se intenta acceder a /dashboard, redirigir a login
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protección extrema para el panel de /admin
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Consultar la base de datos para ver si tiene rol 'admin'
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (profile?.role !== "admin") {
      // Si un usuario normal intenta entrar a /admin, expulsarlo a su dashboard
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Si hay sesión y se intenta acceder a /auth/login o registro, redirigir siempre al dashboard
  if (user && (pathname === "/auth/login" || pathname === "/auth/registro")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/admin/:path*"],
};
