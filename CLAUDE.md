# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog for Eshaan Modi. Dark, circuit-board inspired design with amber/copper accent colors. Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript, and MDX for content. Dark mode only by design.

## Commands

- `npm run dev` — dev server at http://localhost:3000 (requires Node 22: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"`)
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

- **Pages** (App Router): `app/` — homepage, `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/about`
- **Content**: MDX files in `content/blog/` and `content/projects/` with YAML frontmatter (`title`, `date`, `summary`, `tags`, `status`, `github`, `demo`)
- **MDX processing**: `lib/mdx.ts` reads content files with `gray-matter` + `reading-time`; `lib/mdx-components.tsx` renders via `next-mdx-remote` with `rehype-pretty-code` for syntax highlighting
- **Components**: `components/layout/` (Sidebar, Footer, ScrollProgress), `components/ui/` (ProjectCard, BlogPostItem, Tag, StatusIndicator, CircuitTrace), `components/animations/` (FadeIn)
- **Design system**: CSS variables in `app/globals.css` under `@theme inline` block. Single accent color (`--color-accent: #E8943A`). Geist Sans + Geist Mono fonts.
- **Circuit trace motif**: Subtle SVG background traces and animated card borders via `CircuitTrace.tsx`. Decorative, not functional — keep them atmospheric.

## Content Authoring

Add a `.mdx` file to `content/blog/` or `content/projects/` with frontmatter. The site rebuilds automatically. Projects support `status` (active/completed/archived) and `github`/`demo` link fields.

## Design Principles

- Dark mode only. No light mode toggle.
- One accent color (amber #E8943A). No gradients, no stock images.
- Monospace font for dates, tags, nav, metadata — the "engineering fingerprint."
- Animations must be subtle and purposeful (Framer Motion). No bouncing, parallax, or scroll-jacking.
- Circuit trace SVGs are a signature element — keep them faint and atmospheric.
