import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  status?: string;
  github?: string;
  demo?: string;
  coverImage?: string;
  readingTime: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

function getPostsFromDir(dir: string): PostMeta[] {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];

  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(fullPath, filename);
      const source = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(source);
      const stats = readingTime(content);

      return {
        slug: filename.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        summary: data.summary || "",
        tags: data.tags || [],
        status: data.status,
        github: data.github,
        demo: data.demo,
        coverImage: data.coverImage,
        readingTime: stats.text,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

function getPost(dir: string, slug: string): Post | null {
  const fullDir = path.join(contentDir, dir);
  const mdxPath = path.join(fullDir, `${slug}.mdx`);
  const mdPath = path.join(fullDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);
  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title || "Untitled",
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      summary: data.summary || "",
      tags: data.tags || [],
      status: data.status,
      github: data.github,
      demo: data.demo,
      coverImage: data.coverImage,
      readingTime: stats.text,
    },
    content,
  };
}

export function getBlogPosts(): PostMeta[] {
  return getPostsFromDir("blog");
}

export function getBlogPost(slug: string): Post | null {
  return getPost("blog", slug);
}

export function getProjects(): PostMeta[] {
  return getPostsFromDir("projects");
}

export function getProject(slug: string): Post | null {
  return getPost("projects", slug);
}
