export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjects } from "@/lib/mdx";
import { MDXContent } from "@/lib/mdx-components";
import { Tag } from "@/components/ui/Tag";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.meta.title };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <ScrollProgress />
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/projects"
          className="font-mono text-xs text-fg-tertiary hover:text-accent transition-colors mb-8 inline-block"
        >
          &larr; Back to Projects
        </Link>

        <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tighter mb-4">
          {project.meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-sm text-fg-tertiary">
            {project.meta.date.replace(/-/g, ".")}
          </span>
          {project.meta.status && (
            <>
              <span className="text-fg-tertiary">·</span>
              <span className="font-mono text-sm text-fg-tertiary uppercase">
                {project.meta.status}
              </span>
            </>
          )}
          {project.meta.tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {/* Project links */}
        <div className="flex gap-4 mb-8">
          {project.meta.github && (
            <a
              href={project.meta.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent hover:text-accent-hover transition-colors"
            >
              GitHub &rarr;
            </a>
          )}
          {project.meta.demo && (
            <a
              href={project.meta.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Live Demo &rarr;
            </a>
          )}
        </div>

        <MDXContent source={project.content} />

        <div className="mt-16 pt-8 border-t border-border-primary">
          <Link
            href="/projects"
            className="font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            &larr; Back to Projects
          </Link>
        </div>
      </article>
    </>
  );
}
