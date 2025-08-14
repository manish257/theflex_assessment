"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "./Container";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-900 text-white">
              FL
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-emerald-900">Flex Living</div>
              <div className="text-xs text-emerald-700/80">Stays that feel like home</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-[15px]">
            <Link className="text-slate-700 hover:text-emerald-900" href="#">Flex Living</Link>
            <Link className="text-slate-700 hover:text-emerald-900" href="#">All listings</Link>
            <Link className="text-slate-700 hover:text-emerald-900" href="#">About</Link>
            <Link className="text-slate-700 hover:text-emerald-900" href="#">Contact</Link>
          </nav>

          {/* Desktop action */}
          <div className="hidden sm:block">
            <a
              href="#inquire"
              className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Book now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="grid gap-2 rounded-xl border border-gray-200 bg-white p-3">
              <Link className="rounded-lg px-3 py-2 hover:bg-gray-50" href="#" onClick={() => setOpen(false)}>
                Flex Living
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-gray-50" href="#" onClick={() => setOpen(false)}>
                All listings
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-gray-50" href="#" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-gray-50" href="#" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <a
                href="#inquire"
                className="mt-1 rounded-full bg-emerald-900 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Book now
              </a>
            </nav>
          </div>
        )}
      </Container>
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
    </header>
  );
}
