import Image from "next/image";
import type { ContentBlock } from "@/types";

type Props = {
  blocks: ContentBlock[];
};

export default function ArticleContent({ blocks }: Props) {
  return (
    <div className="article-prose">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block: ContentBlock, key: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={key}
          className="my-5 text-[1.075rem] leading-8 text-foreground/85"
        >
          {block.text}
        </p>
      );
    case "heading":
      return block.level === 2 ? (
        <h2
          key={key}
          className="font-display mt-12 mb-5 text-3xl leading-tight tracking-tight"
        >
          {block.text}
        </h2>
      ) : (
        <h3 key={key} className="mt-10 mb-4 text-xl font-semibold tracking-tight">
          {block.text}
        </h3>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="font-display my-8 border-l-4 border-brand pl-6 text-2xl leading-snug italic text-foreground/90"
        >
          “{block.text}”
        </blockquote>
      );
    case "unordered-list":
      return (
        <ul
          key={key}
          className="my-5 list-disc space-y-2 pl-6 text-[1.05rem] leading-8 text-foreground/85 marker:text-muted"
        >
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol
          key={key}
          className="my-5 list-decimal space-y-2 pl-6 text-[1.05rem] leading-8 text-foreground/85 marker:text-muted"
        >
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure key={key} className="my-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-surface-soft">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center text-sm text-muted">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
  }
}
