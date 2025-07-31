import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function preprocessMarkdown(content: string): string {
  return content
    .replace(/\n\n+/g, '\n\n')
    .replace(/([.!?])\s+(?=[A-Z])/g, '$1\n\n')
    .replace(/(?<=\n)([^#\n-*+0-9].*?)(?=\n\n)/g, (match) => {
      if (match.length > 120) {
        return match.replace(/(\w+)\s+/g, (m, word, offset) => {
          const lineLength = match.slice(0, offset).split('\n').pop()?.length || 0;
          return lineLength > 80 ? word + '\n' : m;
        });
      }
      return match;
    })
    .trim();
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    const processedContent = useMemo(() => preprocessMarkdown(content), [content]);
    return <ReactMarkdown>{processedContent}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
