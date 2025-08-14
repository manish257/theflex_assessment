import Container from "./Container";

export default function GoodToKnow() {
  return (
    <section className="mt-10">
      <Container>
        <div className="mb-6 h-px bg-gray-200" />
        <h2 className="text-xl font-semibold text-emerald-950 sm:text-2xl">Good to know</h2>

        <div className="mt-4 grid grid-cols-1 gap-y-6 text-[15px] sm:grid-cols-2 sm:gap-x-12">
          <div>
            <h3 className="mb-2 font-semibold">House Rules</h3>
            <p>Check-in: 3 pm</p>
            <p>Check-out: 10 am</p>
            <button className="mt-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm">
              Show more
            </button>
          </div>
          <div>
            <div className="h-6" />
            <p>Pets: not allowed</p>
            <p>Smoking inside: not allowed</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-2 font-semibold">Cancellation Policy</h3>
          <p className="text-[15px]">100% refund up to 14 days before arrival</p>
        </div>
      </Container>
    </section>
  );
}
