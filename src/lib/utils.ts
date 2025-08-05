import { UIMessageWithMetadata } from "@/types/message";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function calculateReasoningTime(
  message: UIMessageWithMetadata
): string | null {
  if (message.metadata?.reasoning_start && message.metadata?.reasoning_end) {
    const duration =
      message.metadata.reasoning_end - message.metadata.reasoning_start;
    return `${(duration / 1000).toFixed(1)}s`;
  }
  return null;
}
