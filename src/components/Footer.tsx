import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <Container>
        <div className="grid items-center gap-6 py-8 sm:grid-cols-2 md:grid-cols-3 md:gap-8 md:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-900 font-bold text-white">
              FL
            </div>
            <button className="text-sm hover:underline">Privacy Policy</button>
            <button className="text-sm hover:underline">Terms and Conditions</button>
          </div>
          <div className="text-sm">+44 7723 745646</div>
          <div className="text-sm">info@theflexliving.com</div>
        </div>
      </Container>
    </footer>
  );
}
