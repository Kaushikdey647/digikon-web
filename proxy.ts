import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - sw.js (service worker; must not run session refresh)
     * - manifest.webmanifest (PWA manifest)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js$|manifest\\.webmanifest$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
