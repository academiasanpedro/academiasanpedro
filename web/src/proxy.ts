// Proxy (antes "middleware") — Protección de rutas y refresco de sesión
// Ref: AcademiaSanPedro/04_Routes.md → Proxy

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // Si Supabase no reconoce la URL de retorno, vuelve a la Site URL ("/") con ?code o ?error:
  // se reenvía al callback para completar el login o mostrar un error comprensible.
  if (request.nextUrl.pathname === "/") {
    const callbackUrl = new URL(`/auth/callback${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(callbackUrl);
  }

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Redirección que conserva las cookies de sesión refrescadas
  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  const isPrivate = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (!user && isPrivate) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return redirectTo(loginUrl);
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") return redirectTo(new URL("/dashboard", request.url));
  }

  if (user && (pathname === "/auth/login" || pathname === "/auth/registro")) {
    return redirectTo(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/registro",
    // Solo cuando "/" llega con parámetros de Supabase (la landing sigue siendo estática)
    { source: "/", has: [{ type: "query", key: "code" }] },
    { source: "/", has: [{ type: "query", key: "error_code" }] },
  ],
};
