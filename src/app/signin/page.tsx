"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignInPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Sign-in failed");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* Simple branded header */}
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
  <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
    <Link href="/" className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-900 text-white">
        FL
      </div>
      <div className="hidden sm:block">
        <div className="text-sm font-semibold text-emerald-900">Flex Living</div>
        <div className="text-xs text-emerald-700/80">Stays that feel like home</div>
      </div>
    </Link>
  </div>
  <div className="h-0.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500" />
</header>

      {/* Content */}
      <main className="mx-auto flex max-w-7xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-900 text-white">
              FL
            </div>
            <div>
              <h1 className="text-xl font-semibold text-emerald-900">Sign in</h1>
              <p className="text-sm text-slate-500">Access your reviews dashboard</p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-900 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Sign in
            </button>

            <p className="text-xs text-slate-500">
              Hint: Password is set by <span className="font-mono">ADMIN_PASSWORD</span> env.
            </p>
          </form>

          {/* Trust badges row to mirror the brand feel */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Badge title="Secure Booking" desc="Bank-level security" />
            <Badge title="Best Price" desc="Guaranteed rates" />
            <Badge title="Secure Payment" desc="Processed safely" />
          </div>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="mt-10 border-t border-emerald-100 bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Flex Living</span>
          <span>Privacy • Terms</span>
        </div>
      </footer>
    </div>
  );
}

function Badge({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4 text-center">
      <div className="mx-auto mb-2 h-6 w-6 rounded-full border border-emerald-200" />
      <div className="text-sm font-medium text-emerald-900">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  );
}
