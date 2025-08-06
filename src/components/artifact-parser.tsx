import React from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { ScrollArea } from "./ui/scroll-area";

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
  const copyContent = () => {
    navigator.clipboard.writeText(artifact.content);
  };

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

  const shouldRenderPreview = () => {
    return (
      artifact.type === "application/vnd.ant.react" ||
      artifact.type === "text/html" ||
      artifact.type === "image/svg+xml"
    );
  };

  return (
    <div className="overflow-hidden absolute top-0 left-0 right-0 bottom-0 z-10">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <span className="font-medium">{artifact.title}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
            {getTypeDisplay()}
          </span>
        </div>
      </div>

      <div className="relative m-6 rounded-lg border bg-background/75">
        <ScrollArea className="h-[calc(100vh-6rem)]">
          {/* {shouldRenderPreview() ? (
            <div className="p-4">
              <pre className="text-sm rounded overflow-x-auto">
                THIS SHOULD RENDER AS A PREVIEW
                <code>{artifact.content}</code>
              </pre>
            </div>
          ) : ( */}
          <div className="p-4">
            <Highlight className="text-sm rounded overflow-x-auto !p-0 !bg-transparent">
              {artifact.content}
            </Highlight>
          </div>
          {/* )} */}
        </ScrollArea>
      </div>
    </div>
  );
}
