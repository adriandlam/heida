import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { gateway } from "@ai-sdk/gateway";

// custom provider with defaultSettingsMiddleware:
export const models = customProvider({
  languageModels: {
    "claude-sonnet-4": wrapLanguageModel({
      model: gateway("claude-sonnet-4-20250514"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
      }),
    }),
    "claude-opus-4": wrapLanguageModel({
      model: gateway("claude-opus-4-20250514"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
      }),
    }),
    "claude-opus-4.1": wrapLanguageModel({
      model: gateway("claude-opus-4-1-20250805"),
      middleware: extractReasoningMiddleware({
        tagName: "reasoning",
      }),
    }),
  },
});
