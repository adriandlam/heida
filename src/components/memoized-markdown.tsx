import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import { CopyButton } from "./copy-button";
import { parseArtifacts, detectOpeningArtifactTag, extractPartialArtifact } from "./artifact-parser";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "math",
    "maction",
    "maligngroup",
    "malignmark",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mglyph",
    "mi",
    "mlabeledtr",
    "mlongdiv",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mscarries",
    "mscarry",
    "msgroup",
    "msline",
    "mspace",
    "msqrt",
    "msrow",
    "mstack",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "semantics",
    "annotation",
    "annotation-xml",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] || []), "className", "id"],
  },
};

export const StreamingMarkdown = memo(
  ({
    content,
    onArtifactFound,
    onArtifactDetected,
    onPartialArtifact,
  }: {
    content?: string;
    onArtifactFound?: (artifact: any) => void;
    onArtifactDetected?: () => void;
    onPartialArtifact?: (partialArtifact: any) => void;
  }) => {
    if (!content) return null;

    const parsedContent = useMemo(() => {
      // Detect opening artifact tags immediately to trigger panel
      detectOpeningArtifactTag(content, onArtifactDetected);
      
      // Extract partial artifact content for streaming
      const { isInsideArtifact, partialArtifact } = extractPartialArtifact(content);
      if (isInsideArtifact && partialArtifact && onPartialArtifact) {
        onPartialArtifact(partialArtifact);
        
        // If we're currently streaming inside an artifact, don't show the content in main chat
        // Only show content before the opening tag
        const openingTagRegex = /<antArtifact\s+[^>]*>/;
        const match = content.match(openingTagRegex);
        if (match && match.index !== undefined) {
          const contentBeforeArtifact = content.slice(0, match.index).trim();
          if (contentBeforeArtifact) {
            return [{ textBefore: contentBeforeArtifact, textAfter: "" }];
          } else {
            return []; // Nothing to show in main chat
          }
        }
      }
      
      return parseArtifacts(content, onArtifactFound);
    }, [content, onArtifactFound, onArtifactDetected, onPartialArtifact]);

    return (
      <div className="max-w-full">
        {parsedContent.map((parsed, index) => (
          <div key={index}>
            {parsed.textBefore && (
              <div
                className="prose prose-sm max-w-full dark:prose-invert break-words overflow-hidden
            prose-headings:text-foreground prose-headings:scroll-m-20
            prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:lg:text-4xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:border-b prose-h2:pb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:first:mt-0 prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-6 prose-h3:mb-3
            prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-6 prose-h3:mb-3
            prose-p:leading-relaxed
            text-[14px]
            prose-p:text-foreground/85
            prose-p:whitespace-pre-wrap
            prose-strong:font-medium prose-strong:text-foreground
            prose-blockquote:mt-6 prose-blockquote:mb-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/20 prose-blockquote:py-2
            prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-ul:[&>li]:mb-1 prose-ul:[&>li]:leading-relaxed
            prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:[&>li]:mt-2 prose-ol:[&>li]:mb-1 prose-ol:[&>li]:leading-relaxed
            prose-li:text-foreground prose-li:marker:text-muted-foreground prose-li:pl-1
            prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-mono prose-code:text-foreground prose-code:break-all
            prose-pre:mb-6 prose-pre:mt-6 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-muted prose-pre:p-4 prose-pre:text-foreground prose-pre:max-w-full prose-pre:border
            prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-a:break-all
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, sanitizeSchema],
                    rehypeKatex,
                    rehypeHighlight,
                    rehypeSlug,
                  ]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      const isInline = !match;

                      return !isInline && match ? (
                        <div className="relative group">
                          <div className="flex justify-between items-center bg-muted px-4 py-2 text-sm">
                            <span className="text-muted-foreground">
                              {match[1]}
                            </span>
                            <CopyButton text={codeString} />
                          </div>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <table className="my-3 overflow-x-auto w-full block whitespace-nowrap rounded-t-lg">
                          {children}
                        </table>
                      );
                    },
                    thead({ children }) {
                      return (
                        <thead className="bg-muted/50 w-full">{children}</thead>
                      );
                    },
                    th({ children, style, ...props }) {
                      return (
                        <th
                          className="!px-3 py-2 text-left font-medium border-b w-full [&[align=center]]:text-center [&[align=right]]:text-right"
                          {...props}
                        >
                          {children}
                        </th>
                      );
                    },
                    td({ children, style, ...props }) {
                      return (
                        <td
                          className="!px-3 py-2 border-b w-full text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                          {...props}
                        >
                          {children}
                        </td>
                      );
                    },
                    tr({ children, ...props }) {
                      return (
                        <tr
                          className="hover:bg-muted/50 transition-colors"
                          {...props}
                        >
                          {children}
                        </tr>
                      );
                    },
                  }}
                >
                  {parsed.textBefore}
                </ReactMarkdown>
              </div>
            )}

            {parsed.artifact && !onArtifactFound && (
              <div className="my-4 p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>{parsed.artifact.title}</span>
                </div>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  {parsed.artifact.type === "application/vnd.ant.react"
                    ? "React Component"
                    : parsed.artifact.type === "application/vnd.ant.code"
                    ? parsed.artifact.language || "Code"
                    : "Artifact"}
                </span>
              </div>
            )}

            {parsed.textAfter && (
              <div
                className="prose prose-sm max-w-full dark:prose-invert break-words overflow-hidden
            prose-headings:text-foreground prose-headings:scroll-m-20
            prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:lg:text-4xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:border-b prose-h2:pb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:first:mt-0 prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-6 prose-h3:mb-3
            prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-6 prose-h4:mb-3
            prose-p:leading-relaxed
            text-[14px]
            prose-p:text-foreground/85
            prose-p:whitespace-pre-wrap
            prose-strong:font-medium prose-strong:text-foreground
            prose-blockquote:mt-6 prose-blockquote:mb-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/20 prose-blockquote:py-2
            prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-ul:[&>li]:mb-1 prose-ul:[&>li]:leading-relaxed
            prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:[&>li]:mt-2 prose-ol:[&>li]:mb-1 prose-ol:[&>li]:leading-relaxed
            prose-li:text-foreground prose-li:marker:text-muted-foreground prose-li:pl-1
            prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-mono prose-code:text-foreground prose-code:break-all
            prose-pre:mb-6 prose-pre:mt-6 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-muted prose-pre:p-4 prose-pre:text-foreground prose-pre:max-w-full prose-pre:border
            prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-a:break-all
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, sanitizeSchema],
                    rehypeKatex,
                    rehypeHighlight,
                    rehypeSlug,
                  ]}
                >
                  {parsed.textAfter}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

StreamingMarkdown.displayName = "StreamingMarkdown";
