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
      model: anthropic("claude-3-7-sonnet-20250219"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
        startWithReasoning: false,
      }),
    }),
  },
});
