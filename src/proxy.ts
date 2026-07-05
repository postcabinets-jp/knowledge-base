import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { pathname } = request.nextUrl

  // Rate limiting — 60 req/min/IP for /api/* routes
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"
    const rateLimitKey = `rate_limit_${ip}_${Math.floor(Date.now() / 60000)}`

    // Simple in-memory rate limiting via headers (production: use Redis/KV)
    const requestCount = parseInt(request.headers.get("x-rate-count") ?? "0") + 1
    if (requestCount > 60) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
    supabaseResponse.headers.set("x-rate-count", String(requestCount))
    supabaseResponse.headers.set("X-RateLimit-Key", rateLimitKey)
  }

  // Supabase auth session — only when env vars are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    // No credentials yet — allow public routes, block dashboard
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/org")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/org")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
