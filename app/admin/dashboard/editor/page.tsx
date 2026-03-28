"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import matter from "gray-matter";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "blog";
  const editSlug = searchParams.get("slug");
  const importContent = searchParams.get("import");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing content if editing
  useEffect(() => {
    if (editSlug) {
      fetch(`/api/admin/content?type=${type}&slug=${editSlug}`)
        .then((r) => r.json())
        .then((data) => {
          const fm = data.frontmatter;
          setTitle(fm.title || "");
          setDate(
            fm.date
              ? new Date(fm.date).toISOString().split("T")[0]
              : date
          );
          setSummary(fm.summary || "");
          setTags((fm.tags || []).join(", "));
          setStatus(fm.status || "");
          setGithub(fm.github || "");
          setDemo(fm.demo || "");
          setDraft(fm.draft || false);
          setContent(data.content);
        });
    }
  }, [editSlug, type]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle imported markdown
  useEffect(() => {
    if (importContent) {
      try {
        const { data, content: body } = matter(importContent);
        setTitle(data.title || "");
        if (data.date)
          setDate(new Date(data.date).toISOString().split("T")[0]);
        setSummary(data.summary || "");
        setTags((data.tags || []).join(", "));
        setStatus(data.status || "");
        setGithub(data.github || "");
        setDemo(data.demo || "");
        setDraft(data.draft || false);
        setContent(body);
      } catch {
        // If parsing fails, just put everything in content
        setContent(importContent);
      }
    }
  }, [importContent]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;

    setSaving(true);
    const slug = editSlug || slugify(title);

    const frontmatter: Record<string, unknown> = {
      title,
      date,
      summary,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (draft) frontmatter.draft = true;
    if (status) frontmatter.status = status;
    if (github) frontmatter.github = github;
    if (demo) frontmatter.demo = demo;

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          slug,
          frontmatter,
          content,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!editSlug) {
          router.replace(
            `/admin/dashboard/editor?type=${type}&slug=${slug}`
          );
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [title, date, summary, tags, status, github, demo, draft, content, type, editSlug, router]);

  // Keyboard shortcut: Cmd/Ctrl+S to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar */}
      <header className="border-b border-border-primary bg-bg-secondary sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="font-mono text-xs text-fg-tertiary hover:text-accent transition-colors"
            >
              &larr; dashboard
            </button>
            <span className="text-border-primary">|</span>
            <span className="font-mono text-xs text-fg-tertiary">
              {editSlug ? `editing: ${editSlug}` : `new ${type}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
                preview
                  ? "bg-accent text-bg-primary"
                  : "text-fg-secondary hover:text-fg-primary border border-border-primary"
              }`}
            >
              {preview ? "edit" : "preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="font-mono text-xs bg-accent hover:bg-accent-hover text-bg-primary px-4 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              {saving ? "saving..." : saved ? "saved!" : "save"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main editor area */}
          <div className="space-y-4">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent border-none text-3xl font-bold tracking-tight text-fg-primary placeholder:text-fg-tertiary focus:outline-none"
            />

            {/* Content area */}
            {preview ? (
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 min-h-[60vh]">
                <div className="prose max-w-none">
                  <MarkdownPreview content={content} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-3 right-3 font-mono text-[10px] text-fg-tertiary">
                  markdown
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content in markdown..."
                  className="w-full min-h-[60vh] bg-bg-secondary border border-border-primary rounded-lg p-6 font-mono text-sm text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent resize-y transition-colors"
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Sidebar: metadata */}
          <div className="space-y-4">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-4 space-y-4">
              <h3 className="font-mono text-xs text-fg-tertiary uppercase tracking-wider">
                Metadata
              </h3>

              <Field label="Date">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary focus:outline-none focus:border-accent transition-colors"
                />
              </Field>

              <Field label="Summary">
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent resize-none transition-colors"
                  placeholder="Brief description..."
                />
              </Field>

              <Field label="Tags (comma separated)">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent transition-colors"
                  placeholder="electronics, PCB, C++"
                />
              </Field>

              {type === "projects" && (
                <>
                  <Field label="Status">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">none</option>
                      <option value="active">active</option>
                      <option value="completed">completed</option>
                      <option value="in-progress">in-progress</option>
                      <option value="archived">archived</option>
                    </select>
                  </Field>

                  <Field label="GitHub URL">
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent transition-colors"
                      placeholder="https://github.com/..."
                    />
                  </Field>

                  <Field label="Demo URL">
                    <input
                      type="url"
                      value={demo}
                      onChange={(e) => setDemo(e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary rounded px-3 py-1.5 font-mono text-xs text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-accent transition-colors"
                      placeholder="https://..."
                    />
                  </Field>
                </>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="draft"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                  className="accent-accent"
                />
                <label
                  htmlFor="draft"
                  className="font-mono text-xs text-fg-secondary"
                >
                  Draft (won&apos;t appear on site)
                </label>
              </div>
            </div>

            {/* Help */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
              <h3 className="font-mono text-xs text-fg-tertiary uppercase tracking-wider mb-3">
                Shortcuts
              </h3>
              <div className="space-y-1.5 font-mono text-xs text-fg-tertiary">
                <div>
                  <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded text-fg-secondary">
                    Cmd+S
                  </kbd>{" "}
                  Save
                </div>
                <div>
                  <code>**bold**</code> &rarr; <strong className="text-fg-primary">bold</strong>
                </div>
                <div>
                  <code>*italic*</code> &rarr; <em className="text-fg-primary">italic</em>
                </div>
                <div>
                  <code>```code```</code> &rarr; code block
                </div>
                <div>
                  <code>## Heading</code> &rarr; heading
                </div>
                <div>
                  <code>[text](url)</code> &rarr; link
                </div>
              </div>
            </div>

            {/* Slug info */}
            <div className="font-mono text-[10px] text-fg-tertiary">
              slug: {editSlug || slugify(title) || "..."}
              <br />
              path: content/{type}/{editSlug || slugify(title) || "..."}.mdx
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-fg-tertiary uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown-to-HTML for preview (no external deps needed in client)
  const html = content
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br />');

  return (
    <div
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="font-mono text-sm text-fg-tertiary">loading editor...</span>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
