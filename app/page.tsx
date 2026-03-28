export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBlogPosts, getProjects } from "@/lib/mdx";
import { BlogPostItem } from "@/components/ui/BlogPostItem";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { CircuitDivider } from "@/components/ui/CircuitTrace";
import { HeroSection } from "./hero";

export default function Home() {
  const posts = getBlogPosts().slice(0, 3);
  const projects = getProjects().slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      {/* Hero */}
      <HeroSection />

      {/* Status indicators */}
      <div className="flex flex-wrap gap-4 mt-6">
        <StatusIndicator color="green" label="Available for work" />
        <StatusIndicator color="yellow" label="Currently building: Portfolio" />
      </div>

      <CircuitDivider />

      {/* Featured Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xs text-fg-tertiary uppercase tracking-widest">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="font-mono text-xs text-accent hover:text-accent-hover transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <CircuitDivider />

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xs text-fg-tertiary uppercase tracking-widest">
            Latest Posts
          </h2>
          <Link
            href="/blog"
            className="font-mono text-xs text-accent hover:text-accent-hover transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        <div>
          {posts.map((post, i) => (
            <BlogPostItem key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      <CircuitDivider />

      {/* About teaser */}
      <section>
        <p className="text-fg-secondary max-w-lg">
          I build things with electrons and code — from circuit boards to cloud
          infrastructure. Engineering is how I think; building is how I learn.
        </p>
        <Link
          href="/about"
          className="inline-block mt-4 font-mono text-sm text-accent hover:text-accent-hover transition-colors"
        >
          More about me &rarr;
        </Link>
      </section>
    </div>
  );
}
