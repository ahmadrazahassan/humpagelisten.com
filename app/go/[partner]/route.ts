import { getPartner } from "@/config/partners";

export async function GET(_req: Request, ctx: RouteContext<"/go/[partner]">) {
  const { partner: slug } = await ctx.params;
  const partner = getPartner(slug);
  if (!partner) return new Response("Not found", { status: 404 });

  const target =
    partner.status === "approved" && partner.affiliateUrl ? partner.affiliateUrl : partner.destinationUrl;

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
