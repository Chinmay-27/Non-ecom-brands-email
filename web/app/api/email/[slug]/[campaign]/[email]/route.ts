import { getEmailHtml } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; campaign: string; email: string }> }
) {
  const { slug, campaign, email } = await params;
  const html = await getEmailHtml(slug, campaign, email);
  if (html == null) {
    return new Response("Email not found", { status: 404 });
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
