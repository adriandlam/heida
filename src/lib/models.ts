import { anthropic } from "@ai-sdk/anthropic";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

// custom provider with defaultSettingsMiddleware:
export const models = customProvider({
  languageModels: {
    "claude-sonnet-4": wrapLanguageModel({
      model: anthropic("claude-sonnet-4-20250514"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
        startWithReasoning: false,
      }),
    }),
    "claude-opus-4": wrapLanguageModel({
      model: anthropic("claude-opus-4-20250514"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
        startWithReasoning: false,
      }),
    }),
    "claude-opus-4.1": wrapLanguageModel({
      model: anthropic("claude-opus-4-1-20250805"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
        startWithReasoning: false,
      }),
    }),
  },
});
