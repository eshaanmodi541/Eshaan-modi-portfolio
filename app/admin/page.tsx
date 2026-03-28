"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          {/* Terminal-style header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-primary">
            <span className="w-3 h-3 rounded-full bg-error" />
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="ml-auto font-mono text-xs text-fg-tertiary">
              admin@signal
            </span>
          </div>

          <div className="font-mono text-xs text-fg-tertiary mb-1">
            $ authenticate
          </div>
          <h1 className="font-mono text-lg text-accent mb-6">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-fg-tertiary uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bg-primary border border-border-primary rounded px-3 py-2 font-mono text-sm text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-fg-tertiary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-bg-primary border border-border-primary rounded px-3 py-2 font-mono text-sm text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="font-mono text-xs text-error">
                error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-bg-primary font-mono text-sm py-2.5 rounded transition-colors disabled:opacity-50"
            >
              {loading ? "authenticating..." : "$ sudo login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
