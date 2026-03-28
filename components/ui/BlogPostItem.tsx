"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/mdx";

export function BlogPostItem({
  post,
  index,
}: {
  post: PostMeta;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-baseline gap-4 py-3 border-b border-border-primary hover:border-accent transition-colors"
      >
        <span className="font-mono text-xs text-fg-tertiary shrink-0 w-24">
          {post.date.replace(/-/g, ".")}
        </span>
        <span className="font-sans text-fg-primary group-hover:text-accent transition-colors flex-1 truncate">
          {post.title}
        </span>
        <span className="font-mono text-xs text-fg-tertiary shrink-0 hidden sm:inline">
          {post.readingTime}
        </span>
      </Link>
    </motion.div>
  );
}
