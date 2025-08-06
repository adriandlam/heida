import React, { useState, useEffect, useRef } from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { ScrollArea } from "./ui/scroll-area";
import { SandpackRenderer } from "./sandpack-renderer";
import { Button } from "./ui/button";
import { Code, CodeIcon, Eye, EyeIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface ArtifactData {
  identifier: string;
  title: string;
  type: string;
  language?: string;
  content: string;
}

interface ParsedContent {
  textBefore: string;
  artifact?: ArtifactData;
  textAfter: string;
}

// Function to detect opening artifact tags immediately (for early panel triggering)
export function detectOpeningArtifactTag(
  content: string,
  onArtifactDetected?: () => void
): boolean {
  const openingTagRegex = /<antArtifact\s+[^>]*>/;
  const hasOpeningTag = openingTagRegex.test(content);

  if (hasOpeningTag && onArtifactDetected) {
    onArtifactDetected();
  }

  return hasOpeningTag;
}

// Function to extract partial artifact data while streaming
export function extractPartialArtifact(content: string): {
  isInsideArtifact: boolean;
  partialArtifact?: Partial<ArtifactData>;
  streamingContent?: string;
} {
  const openingTagRegex = /<antArtifact\s+([^>]+)>/;
  const closingTagRegex = /<\/antArtifact>/;

  const openingMatch = content.match(openingTagRegex);
  const hasClosingTag = closingTagRegex.test(content);

  // Not inside an artifact
  if (!openingMatch) {
    return { isInsideArtifact: false };
  }

  // Parse attributes from opening tag
  const attributeString = openingMatch[1];
  const identifier = attributeString.match(/identifier="([^"]*)"/)?.[1] || "";
  const title = attributeString.match(/title="([^"]*)"/)?.[1] || "";
  const type = attributeString.match(/type="([^"]*)"/)?.[1] || "";
  const language = attributeString.match(/language="([^"]*)"/)?.[1];

  // Get content after opening tag
  const openingTagEnd = openingMatch.index! + openingMatch[0].length;
  let artifactContent = content.slice(openingTagEnd);

  // If there's a closing tag, extract content before it
  if (hasClosingTag) {
    const closingTagMatch = artifactContent.match(closingTagRegex);
    if (closingTagMatch) {
      artifactContent = artifactContent.slice(0, closingTagMatch.index);
    }
  }

  return {
    isInsideArtifact: true,
    partialArtifact: {
      identifier,
      title,
      type,
      language,
      content: artifactContent.trim(),
    },
    streamingContent: artifactContent.trim(),
  };
}

export function parseArtifacts(
  content: string,
  onArtifactFound?: (artifact: ArtifactData) => void
): ParsedContent[] {
  if (!content || typeof content !== "string") {
    return [{ textBefore: content || "", textAfter: "" }];
  }

  const artifactRegex = /<antArtifact\s+([^>]+)>([\s\S]*?)<\/antArtifact>/g;
  const matches = [...content.matchAll(artifactRegex)];

  // If no artifacts found, return original content
  if (matches.length === 0) {
    return [{ textBefore: content, textAfter: "" }];
  }

  const results: ParsedContent[] = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    // Add text before artifact
    if (match.index !== undefined && match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        results.push({ textBefore, textAfter: "" });
      }
    }

    // Parse artifact attributes
    const attributeString = match[1];
    const artifactContent = match[2].trim();

    const identifier = attributeString.match(/identifier="([^"]*)"/)?.[1] || "";
    const title = attributeString.match(/title="([^"]*)"/)?.[1] || "";
    const type = attributeString.match(/type="([^"]*)"/)?.[1] || "";
    const language = attributeString.match(/language="([^"]*)"/)?.[1];

    const artifact: ArtifactData = {
      identifier,
      title,
      type,
      language,
      content: artifactContent,
    };

    // Notify parent component about the artifact
    if (onArtifactFound) {
      onArtifactFound(artifact);
    }

    results.push({ textBefore: "", artifact, textAfter: "" });
    lastIndex = (match.index || 0) + match[0].length;
  });

  // Add remaining text after last artifact
  if (lastIndex < content.length) {
    const textAfter = content.slice(lastIndex).trim();
    if (textAfter) {
      results.push({ textBefore: textAfter, textAfter: "" });
    }
  }

  return results;
}

interface ArtifactRendererProps {
  artifact: ArtifactData;
}

export function ArtifactRenderer({ artifact }: ArtifactRendererProps) {
  const [viewMode, setViewMode] = useState<"artifact" | "code">("code");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const contentLengthRef = useRef(artifact.content.length);

  const shouldUseSandpack = () => {
    return (
      artifact.type === "application/vnd.ant.react" ||
      artifact.type === "text/html" ||
      (artifact.type === "application/vnd.ant.code" &&
        (artifact.language === "javascript" ||
          artifact.language === "js" ||
          artifact.language === "typescript" ||
          artifact.language === "ts" ||
          artifact.language === "css"))
    );
  };

  // Detect when artifact is complete and auto-switch to preview (only if user hasn't interacted)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (artifact.content.length === contentLengthRef.current) {
        // Auto-switch to preview for sandpack-compatible artifacts, but only if user hasn't manually interacted
        if (shouldUseSandpack() && viewMode === "code" && !hasUserInteracted) {
          setTimeout(() => setViewMode("artifact"), 1000);
        }
      }
      contentLengthRef.current = artifact.content.length;
    }, 500);

    return () => clearTimeout(timer);
  }, [artifact.content, viewMode, hasUserInteracted]);

  const getTypeDisplay = () => {
    switch (artifact.type) {
      case "application/vnd.ant.code":
        return artifact.language || "Code";
      case "text/html":
        return "HTML";
      case "application/vnd.ant.react":
        return "React Component";
      case "image/svg+xml":
        return "SVG";
      case "application/vnd.ant.mermaid":
        return "Mermaid Diagram";
      case "text/markdown":
        return "Markdown";
      default:
        return "Artifact";
    }
  };

  return (
    <div className="overflow-hidden absolute top-0 left-0 right-0 bottom-0 z-10">
      <div className="flex items-center px-3.5 py-2.5 bg-muted/50 border-b gap-8">
        <div className="flex items-center gap-2">
          <span className="font-medium">{artifact.title}</span>
        </div>
        {shouldUseSandpack() && (
          <div className="flex items-center gap-0.5 bg-background rounded-md p-0.5">
            <Button
              variant={viewMode === "artifact" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => {
                setHasUserInteracted(true);
                setViewMode("artifact");
              }}
              className={cn(
                "h-7 w-8 rounded-md",
                viewMode !== "artifact" && "text-muted-foreground/75"
              )}
            >
              <EyeIcon />
            </Button>
            <Separator orientation="vertical" className="!h-4" />
            <Button
              variant={viewMode === "code" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => {
                setHasUserInteracted(true);
                setViewMode("code");
              }}
              className={cn(
                "h-7 w-8 rounded-md",
                viewMode !== "code" && "text-muted-foreground/75"
              )}
            >
              <CodeIcon />
            </Button>
          </div>
        )}
      </div>

      <div className="relative m-6">
        {shouldUseSandpack() ? (
          <div className="h-[calc(100vh-6rem)] border rounded-xl">
            {/* {viewMode === "artifact" ? ( */}
            <SandpackRenderer
              content={artifact.content}
              type={artifact.type}
              language={artifact.language}
              viewMode={viewMode}
            />
            {/* ) : (
              <ScrollArea className="h-full">
                <div className="p-4">
                  <Highlight className="text-sm rounded overflow-x-auto !p-0 !bg-background/75">
                    {artifact.content}
                  </Highlight>
                </div>
              </ScrollArea>
            )} */}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <div className="p-4">
              <Highlight className="text-sm rounded overflow-x-auto !p-0 !bg-transparent">
                {artifact.content}
              </Highlight>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
