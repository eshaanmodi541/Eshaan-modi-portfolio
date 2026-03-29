import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const components = {
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt || ""}
      width={800}
      height={450}
      className="rounded-lg my-6 max-w-full h-auto"
      sizes="(max-width: 768px) 100vw, 800px"
    />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: "github-dark-default",
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
