import { getBlogPosts } from "@/lib/mdx";
import { BlogPostItem } from "@/components/ui/BlogPostItem";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-sans text-4xl font-bold tracking-tighter mb-2">
        Signal Log
      </h1>
      <p className="font-mono text-sm text-fg-tertiary mb-12">
        Notes on electronics, code, and engineering.
      </p>

      <div>
        {posts.map((post, i) => (
          <BlogPostItem key={post.slug} post={post} index={i} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-fg-tertiary font-mono text-sm">
          No posts yet. Check back soon.
        </p>
      )}
    </div>
  );
}
