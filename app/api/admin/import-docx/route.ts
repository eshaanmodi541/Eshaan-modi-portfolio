import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const imageDir = path.join(process.cwd(), "public", "images");
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret"
);

// Convert HTML to clean markdown
function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove wrapping <p> around images (mammoth wraps them)
  md = md.replace(/<p>\s*(<img [^>]+>)\s*<\/p>/g, "$1");

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "# $1\n\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "## $1\n\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "### $1\n\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/g, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/g, "###### $1\n\n");

  // Bold and italic
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**");
  md = md.replace(/<b>([\s\S]*?)<\/b>/g, "**$1**");
  md = md.replace(/<em>([\s\S]*?)<\/em>/g, "*$1*");
  md = md.replace(/<i>([\s\S]*?)<\/i>/g, "*$1*");

  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)");

  // Images (already converted by mammoth handler, but just in case)
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/g, "![$2]($1)");
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/g, "![$1]($2)");
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*\/?>/g, "![]($1)");

  // Unordered lists
  md = md.replace(/<ul>([\s\S]*?)<\/ul>/g, (_, inner) => {
    return inner.replace(/<li>([\s\S]*?)<\/li>/g, "- $1\n") + "\n";
  });

  // Ordered lists
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/g, (_, inner: string) => {
    let i = 0;
    return inner.replace(/<li>([\s\S]*?)<\/li>/g, (__, content: string) => {
      i++;
      return `${i}. ${content}\n`;
    }) + "\n";
  });

  // Blockquotes
  md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, inner) => {
    return inner
      .split("\n")
      .map((line: string) => `> ${line}`)
      .join("\n") + "\n\n";
  });

  // Code blocks
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1\n```\n\n");
  md = md.replace(/<code>([\s\S]*?)<\/code>/g, "`$1`");

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/g, "---\n\n");

  // Line breaks
  md = md.replace(/<br\s*\/?>/g, "\n");

  // Paragraphs
  md = md.replace(/<p>([\s\S]*?)<\/p>/g, "$1\n\n");

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, " ");

  // Decode &gt; but keep &lt; that would break MDX (it treats `<` as JSX)
  // Only decode &lt; when it's part of valid HTML-like syntax (letter after <)
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&lt;(?=[a-zA-Z!/])/g, "<");
  // Leave remaining &lt; as-is (e.g. &lt;5 micrometers) — MDX-safe

  // Clean up excessive whitespace
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();

  return md;
}

export async function POST(request: NextRequest) {
  // Auth check (this route is excluded from middleware to avoid body size limits)
  const token = request.cookies.get("admin-session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "blog";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".docx")) {
    return NextResponse.json({ error: "Only .docx files are supported" }, { status: 400 });
  }

  // Limit to 50MB
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  const targetDir = path.join(imageDir, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const savedImages: string[] = [];
  let imageIndex = 0;

  try {
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          imageIndex++;
          const ext = image.contentType
            ? `.${image.contentType.split("/")[1].replace("jpeg", "jpg")}`
            : ".png";
          const filename = `docx-image-${timestamp}-${imageIndex}${ext}`;
          const filePath = path.join(targetDir, filename);

          const imageBuffer = await image.read();
          fs.writeFileSync(filePath, imageBuffer);

          const publicPath = `/images/${folder}/${filename}`;
          savedImages.push(publicPath);

          return { src: publicPath };
        }),
      }
    );

    const markdown = htmlToMarkdown(result.value);

    return NextResponse.json({
      success: true,
      markdown,
      images: savedImages,
      warnings: result.messages
        .filter((m) => m.type === "warning")
        .map((m) => m.message),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to convert document: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    );
  }
}
