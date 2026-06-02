import { listBrands, getCampaigns } from "@/lib/data";
import Viewer from "./Viewer";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const { brand } = await searchParams;
  const brands = await listBrands();
  const selectedSlug = brand || brands[0]?.slug || null;
  const campaigns = selectedSlug ? await getCampaigns(selectedSlug) : null;

  return (
    <Viewer brands={brands} selectedSlug={selectedSlug} campaigns={campaigns} />
  );
}
