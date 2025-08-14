import Container from "./Container";
import Image from "next/image";

export default function GallerySection() {
  return (
    <section className="mt-6">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Collage */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:col-span-8 lg:grid-rows-2">
            {/* Main image */}
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl sm:col-span-4">
              <Image
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600"
                alt="Main"
                width={1600}
                height={380}
                className="h-56 w-full object-cover sm:h-80 lg:h-[380px]"
                priority
              />
            </div>

            {/* Second image */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800"
                alt="Bedroom"
                width={800}
                height={180}
                className="h-32 w-full object-cover sm:h-[180px]"
              />
            </div>

            {/* Third image */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800"
                alt="Living Room"
                width={800}
                height={180}
                className="h-32 w-full object-cover sm:h-[180px]"
              />
            </div>

            {/* Fourth image - replaced */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
                alt="Modern Kitchen"
                width={800}
                height={180}
                className="h-32 w-full object-cover sm:h-[180px]"
              />
            </div>

            {/* Fifth image with button */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800"
                alt="Dining Area"
                width={800}
                height={180}
                className="h-32 w-full object-cover sm:h-[180px]"
              />
              <button className="absolute bottom-2 right-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs shadow sm:bottom-3 sm:right-3 sm:text-sm">
                + 17 photos
              </button>
            </div>
          </div>

          {/* Right rail booking card */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="mb-4 text-sm text-slate-500">
                Select dates and number of guests to see the total price per night
              </p>
              <div className="space-y-3">
                <div className="rounded-full border border-gray-200 px-4 py-3">Select Dates</div>
                <div className="rounded-full border border-gray-200 px-4 py-3">1</div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button className="w-full rounded-full bg-emerald-900 py-3 font-semibold text-white sm:flex-1">
                    Book now
                  </button>
                  <button className="w-full rounded-full border border-gray-200 bg-white py-3 sm:flex-1">
                    Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
