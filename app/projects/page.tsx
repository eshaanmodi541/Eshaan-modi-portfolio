export const dynamic = "force-dynamic";

import { getProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-sans text-4xl font-bold tracking-tighter mb-2">
        Projects
      </h1>
      <p className="text-fg-secondary mb-12">
        A selection of things I&apos;ve built, broken, and rebuilt.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-fg-tertiary font-mono text-sm">
          No projects yet. Check back soon.
        </p>
      )}
    </div>
  );
}
