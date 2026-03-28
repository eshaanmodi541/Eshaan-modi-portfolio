import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content");

function listContent(type: string) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const source = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(source);
      const stats = readingTime(content);

      return {
        slug: filename.replace(/\.mdx?$/, ""),
        filename,
        title: data.title || "Untitled",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "",
        summary: data.summary || "",
        tags: data.tags || [],
        status: data.status || "",
        draft: data.draft || false,
        readingTime: stats.text,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// GET - list content or get single file
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "blog";
  const slug = searchParams.get("slug");

  if (slug) {
    const dir = path.join(contentDir, type);
    const mdxPath = path.join(dir, `${slug}.mdx`);
    const mdPath = path.join(dir, `${slug}.md`);
    const filePath = fs.existsSync(mdxPath)
      ? mdxPath
      : fs.existsSync(mdPath)
      ? mdPath
      : null;

    if (!filePath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const source = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(source);

    return NextResponse.json({
      frontmatter: data,
      content,
      filename: path.basename(filePath),
    });
  }

  return NextResponse.json({
    blog: listContent("blog"),
    projects: listContent("projects"),
  });
}

// POST - create or update content
export async function POST(request: NextRequest) {
  const { type, slug, frontmatter, content } = await request.json();

  if (!type || !slug || !frontmatter || content === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `${slug}.mdx`;
  const filePath = path.join(dir, filename);

  // Build the MDX file content
  const fileContent = matter.stringify(content, frontmatter);

  fs.writeFileSync(filePath, fileContent, "utf-8");

  // Revalidate affected pages so changes appear immediately
  revalidatePath("/");
  revalidatePath(`/${type}`);
  revalidatePath(`/${type}/${slug}`);

  return NextResponse.json({ success: true, slug, filename });
}

// DELETE - remove content
export async function DELETE(request: NextRequest) {
  const { type, slug } = await request.json();

  if (!type || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const dir = path.join(contentDir, type);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);

  if (fs.existsSync(mdxPath)) fs.unlinkSync(mdxPath);
  else if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath);
  else return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Revalidate affected pages
  revalidatePath("/");
  revalidatePath(`/${type}`);
  revalidatePath(`/${type}/${slug}`);

  return NextResponse.json({ success: true });
}
