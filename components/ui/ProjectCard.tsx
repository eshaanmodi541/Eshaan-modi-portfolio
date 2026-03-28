"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag } from "./Tag";
import type { PostMeta } from "@/lib/mdx";

export function ProjectCard({
  project,
  index,
}: {
  project: PostMeta;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/projects/${project.slug}`} className="block group">
        <div className="relative bg-bg-secondary border border-border-primary rounded-lg p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_var(--color-trace-glow)] hover:-translate-y-0.5 overflow-hidden">
          {/* Animated trace border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="8"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              className="group-hover:animate-[trace_0.6s_ease-out_forwards]"
            />
          </svg>

          <div className="flex items-start justify-between mb-3">
            <span className="font-mono text-xs text-fg-tertiary">{num}</span>
            {project.status && (
              <StatusDot status={project.status} />
            )}
          </div>

          <h3 className="font-sans font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          {project.summary && (
            <p className="text-fg-secondary text-sm mb-4 line-clamp-2">
              {project.summary}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.tags?.slice(0, 4).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <span className="text-accent text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-success",
    "in-progress": "bg-accent",
    completed: "bg-info",
    archived: "bg-fg-tertiary",
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${colors[status.toLowerCase()] || colors.active}`}
      />
      <span className="font-mono text-[10px] text-fg-tertiary uppercase tracking-wider">
        {status}
      </span>
    </div>
  );
}
