import { getServerStatus } from "@/lib/mc-status";
import { siteConfig } from "@/lib/site";

// `node:net` sockets are required to speak the Minecraft status protocol.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live server status for `lushvanilla.net:27548`.
 *
 * The result is cached server-side for 15 seconds (see `getServerStatus`), so
 * this endpoint is safe to poll aggressively from many visitors at once.
 */
export async function GET() {
  const result = await getServerStatus();

  return Response.json(
    {
      server: {
        host: siteConfig.host,
        port: siteConfig.port,
        address: siteConfig.address,
        discord: siteConfig.discord,
      },
      ...result,
    },
    {
      status: result.ok ? 200 : 503,
      headers: {
        // A short shared-cache window plus background revalidation keeps the
        // counter feeling live without letting a CDN pin a stale number.
        "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=20",
      },
    },
  );
}
