// proxy.ts (This is the corrected file)

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - register (register page)
     * - / (the root landing page)
     * - any files with an extension (e.g. .png)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|$|.*\\.).*)",
  ],
};