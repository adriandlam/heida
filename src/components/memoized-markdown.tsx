import { memo } from "react";
import ReactMarkdown from "react-markdown";

export const StreamingMarkdown = memo(({ content }: { content?: string }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
});

StreamingMarkdown.displayName = "StreamingMarkdown";
