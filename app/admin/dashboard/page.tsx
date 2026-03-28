"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ContentItem {
  slug: string;
  filename: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status: string;
  draft: boolean;
  readingTime: string;
}

export default function Dashboard() {
  const [content, setContent] = useState<{
    blog: ContentItem[];
    projects: ContentItem[];
  }>({ blog: [], projects: [] });
  const [activeTab, setActiveTab] = useState<"blog" | "projects">("blog");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(type: string, slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug }),
    });

    if (res.ok) fetchContent();
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  }

  const items = content[activeTab];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar */}
      <header className="border-b border-border-primary bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="font-mono text-sm text-fg-primary">
              admin panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs text-fg-tertiary hover:text-accent transition-colors"
            >
              view site &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="font-mono text-xs text-fg-tertiary hover:text-error transition-colors"
            >
              logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 bg-bg-secondary rounded-lg p-1 border border-border-primary">
            {(["blog", "projects"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-xs px-4 py-2 rounded transition-colors ${
                  activeTab === tab
                    ? "bg-accent text-bg-primary"
                    : "text-fg-secondary hover:text-fg-primary"
                }`}
              >
                /{tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/admin/dashboard/editor?type=${activeTab}`}
              className="font-mono text-xs bg-accent hover:bg-accent-hover text-bg-primary px-4 py-2 rounded transition-colors"
            >
              + new {activeTab === "blog" ? "post" : "project"}
            </Link>
            <label className="font-mono text-xs bg-bg-secondary border border-border-primary hover:border-accent text-fg-secondary px-4 py-2 rounded transition-colors cursor-pointer">
              upload .md
              <input
                type="file"
                accept=".md,.mdx"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  // Parse and redirect to editor with content
                  const params = new URLSearchParams({
                    type: activeTab,
                    import: text,
                  });
                  router.push(`/admin/dashboard/editor?${params}`);
                }}
              />
            </label>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="font-mono text-sm text-fg-tertiary">loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-primary rounded-lg">
            <p className="font-mono text-sm text-fg-tertiary mb-4">
              no {activeTab} entries yet
            </p>
            <Link
              href={`/admin/dashboard/editor?type=${activeTab}`}
              className="font-mono text-xs text-accent hover:text-accent-hover"
            >
              create your first one &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.slug}
                className="bg-bg-secondary border border-border-primary rounded-lg p-4 flex items-center justify-between gap-4 hover:border-accent/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-medium text-fg-primary truncate">
                      {item.title}
                    </h3>
                    {item.draft && (
                      <span className="font-mono text-[10px] text-accent bg-accent-muted px-1.5 py-0.5 rounded uppercase">
                        draft
                      </span>
                    )}
                    {item.status && (
                      <span className="font-mono text-[10px] text-fg-tertiary uppercase">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-fg-tertiary">
                      {item.date}
                    </span>
                    <span className="font-mono text-xs text-fg-tertiary">
                      {item.readingTime}
                    </span>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-accent"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/dashboard/editor?type=${activeTab}&slug=${item.slug}`}
                    className="font-mono text-xs text-fg-secondary hover:text-accent transition-colors px-2 py-1"
                  >
                    edit
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(activeTab, item.slug, item.title)
                    }
                    className="font-mono text-xs text-fg-tertiary hover:text-error transition-colors px-2 py-1"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
