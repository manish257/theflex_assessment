import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import Container from "@/components/Container";
import GoodToKnow from "@/components/GoodToKnow";
import Footer from "@/components/Footer";

type Review = {
  id: string;
  listingName: string;
  overallRating: number | null;
  categories: { category: string; rating: number | null }[];
  text: string;
  authorName: string | null;
  submittedAt: string;
};

async function getApproved(slug: string): Promise<Review[]> {
  const listingKey = slug.startsWith("listing-") ? slug : `listing-${slug}`;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(
    `${base}/api/reviews/public?listingKey=${encodeURIComponent(listingKey)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [] as Review[];

  const json = await res.json();
  return json.items as Review[];
}


export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await getApproved(slug);
  const listingName =
    items[0]?.listingName ||
    decodeURIComponent(slug.replace(/^listing-/, "").replace(/-/g, " "));
  const count = items.length;
  const avg10 =
    count > 0
      ? Number(
          (
            items.reduce((s, r) => s + (r.overallRating ?? 0), 0) / count
          ).toFixed(2)
        )
      : null;
  const stars5 = avg10 != null ? Math.round((avg10 / 10) * 5) : 0;

  return (
    <>
      <Navbar />
      <GallerySection />

      {/* header with title and rating */}
      <div className="mt-6">
        <Container>
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-emerald-900">
              {listingName}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="text-lg text-amber-500"
                  aria-label={`rating ${avg10 ?? "-"} / 10`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < stars5 ? "★" : "☆"}</span>
                  ))}
                </div>
                {avg10 != null && (
                  <span className="font-medium text-emerald-900">
                    {avg10.toFixed(1)}/10
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {count} review{count === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-6 h-px bg-gray-200" />
          </header>
        </Container>
      </div>

      <ReviewsSection items={items} avg10={avg10} count={count} />
      <GoodToKnow />
      <Footer />
    </>
  );
}
