import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const components = {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} loading="lazy" />
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
