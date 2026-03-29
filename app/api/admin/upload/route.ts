import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "images");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "blog";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Only allow image files
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  // Limit to 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  // Sanitize filename: lowercase, replace spaces with hyphens, keep only safe chars
  const ext = path.extname(file.name).toLowerCase();
  const baseName = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const timestamp = Date.now();
  const filename = `${baseName}-${timestamp}${ext}`;

  // Ensure target directory exists
  const targetDir = path.join(uploadDir, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write file
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buffer);

  const publicPath = `/images/${folder}/${filename}`;

  return NextResponse.json({ success: true, path: publicPath, filename });
}
