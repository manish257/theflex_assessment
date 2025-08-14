// Public listing page showing only approved reviews
import { headers } from 'next/headers';
import Link from 'next/link';
import ReviewCard from '@/components/ReviewCard';

/* simple container */
function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1180px] mx-auto px-5">{children}</div>;
}

/* gallery section placed above reviews */
function GallerySection() {
  return (
    <section className="mt-6">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* collage */}
          <div className="lg:col-span-8 grid grid-cols-4 grid-rows-2 gap-4">
            <div className="col-span-4 row-span-2 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600"
                alt="Main"
                className="h-[380px] w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800"
                alt=""
                className="h-[180px] w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800"
                alt=""
                className="h-[180px] w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1616593961161-122bcb4837b2?q=80&w=800"
                alt=""
                className="h-[180px] w-full object-cover"
              />
            </div>
            <div className="col-span-2 relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800"
                alt=""
                className="h-[180px] w-full object-cover"
              />
              <button className="absolute bottom-3 right-3 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm shadow">
                + 17 photos
              </button>
            </div>
          </div>

          {/* booking card placeholder right rail */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm text-slate-500">
                Select dates and number of guests to see the total price per night
              </p>
              <div className="space-y-3">
                <div className="rounded-full border border-gray-200 px-4 py-3">Select Dates</div>
                <div className="rounded-full border border-gray-200 px-4 py-3">1</div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 rounded-full bg-emerald-900 py-3 font-semibold text-white">Book now</button>
                  <button className="flex-1 rounded-full border border-gray-200 bg-white py-3">Send Inquiry</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

async function getApproved(slug: string) {
  const listingKey = slug.startsWith('listing-') ? slug : `listing-${slug}`;
  const h = await headers();
  const host = h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/reviews/public?listingKey=${encodeURIComponent(listingKey)}`, { cache: 'no-store' });
  if (!res.ok) return [] as Array<{ id: string; listingName: string; overallRating: number | null; categories: { category: string; rating: number | null }[]; text: string; authorName: string | null; submittedAt: string }>;
  const json = await res.json();
  return json.items as Array<{
    id: string;
    listingName: string;
    overallRating: number | null;
    categories: { category: string; rating: number | null }[];
    text: string;
    authorName: string | null;
    submittedAt: string;
  }>;
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await getApproved(slug);
  const listingName =
    items[0]?.listingName || decodeURIComponent(slug.replace(/^listing-/, '').replace(/-/g, ' '));
  const count = items.length;
  const avg10 =
    count > 0 ? Number((items.reduce((s, r) => s + (r.overallRating ?? 0), 0) / count).toFixed(2)) : null;
  const stars5 = avg10 != null ? Math.round((avg10 / 10) * 5) : 0;

  return (
    <>
      {/* modern navbar with Flex colors */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-900 text-white">
                FL
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-emerald-900">Flex Living</div>
                <div className="text-xs text-emerald-700/80">Stays that feel like home</div>
              </div>
            </Link>

            {/* nav links */}
            <nav className="hidden md:flex items-center gap-6 text-[15px]">
              <a className="text-slate-700 hover:text-emerald-900" href="#">Flex Living</a>
              <a className="text-slate-700 hover:text-emerald-900" href="#">All listings</a>
              <a className="text-slate-700 hover:text-emerald-900" href="#">About</a>
              <a className="text-slate-700 hover:text-emerald-900" href="#">Contact</a>
            </nav>

            {/* action */}
            <div className="hidden sm:block">
              <a
                href="#inquire"
                className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Book now
              </a>
            </div>
          </div>
        </Container>
        {/* thin brand accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
      </header>

      {/* gallery */}
      <GallerySection />

      {/* header with title and rating */}
      <div className="mt-6">
        <Container>
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-emerald-900">{listingName}</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-lg text-amber-500" aria-label={`rating ${avg10 ?? '-'} / 10`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < stars5 ? '★' : '☆'}</span>
                  ))}
                </div>
                {avg10 != null && (
                  <span className="font-medium text-emerald-900">{avg10.toFixed(1)}/10</span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {count} review{count === 1 ? '' : 's'}
              </span>
            </div>
            <div className="mt-6 h-px bg-gray-200" />
          </header>
        </Container>
      </div>

      {/* reviews */}
      <section id="reviews" className="mt-10">
        <Container>
          {/* section header */}
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-emerald-950">Reviews</h2>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">★</span>
              {avg10 != null && <span className="font-medium text-slate-900">{avg10.toFixed(1)}</span>}
              <span className="text-sm text-gray-500">({count} {count === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>

          {count === 0 ? (
            <div className="text-gray-500">No reviews selected yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="
                    rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
                    [&>div]:border-0 [&>div]:p-0 [&>div]:bg-transparent
                  "
                >
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
