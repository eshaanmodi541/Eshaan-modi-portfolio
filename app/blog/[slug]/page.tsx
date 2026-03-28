import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/mdx";
import { MDXContent } from "@/lib/mdx-components";
import { Tag } from "@/components/ui/Tag";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return { title: post.meta.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <ScrollProgress />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/blog"
          className="font-mono text-xs text-fg-tertiary hover:text-accent transition-colors mb-8 inline-block"
        >
          &larr; Back to Blog
        </Link>

        <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tighter mb-4">
          {post.meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="font-mono text-sm text-fg-tertiary">
            {post.meta.date.replace(/-/g, ".")}
          </span>
          <span className="text-fg-tertiary">·</span>
          <span className="font-mono text-sm text-fg-tertiary">
            {post.meta.readingTime}
          </span>
          {post.meta.tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <MDXContent source={post.content} />

        <div className="mt-16 pt-8 border-t border-border-primary">
          <Link
            href="/blog"
            className="font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </article>
    </>
  );
}
