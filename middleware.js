// Edge Middleware — Basic Auth gate for the internal dashboard.
// Everything under /intern/* requires the INTERN_USER / INTERN_PASS credentials
// (set as Vercel project env vars). All public funnel pages are unaffected.
export const config = { matcher: ["/intern/:path*"] };

export default function middleware(req) {
  const user = process.env.INTERN_USER || "mamaspagat";
  const pass = process.env.INTERN_PASS || "";

  const header = req.headers.get("authorization") || "";
  if (pass && header === "Basic " + btoa(user + ":" + pass)) {
    return; // authorized -> continue to the static file
  }
  return new Response("Authentifizierung erforderlich.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Intern - Funnel Dashboard", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
