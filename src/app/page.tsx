"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StreamingMarkdown } from "@/components/memoized-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateReasoningTime, cn, countWords } from "@/lib/utils";
import { UIMessageWithMetadata } from "@/types/message";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ArtifactRenderer } from "@/components/artifact-parser";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClockFadingIcon,
  CopyIcon,
  GlobeIcon,
  LetterTextIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";

const chat = new Chat<UIMessageWithMetadata>({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),
});

interface OverflowFile {
  id: string;
  content: string;
  wordCount: number;
  charCount: number;
  createdAt: Date;
}

const messages = [
  {
    parts: [
      {
        type: "text",
        text: "what's the new open source gpt model",
      },
    ],
    id: "1btINOvDKULBXgsy",
    role: "user",
  },
  {
    id: "c9ClbsZOVIaBq5QC",
    role: "assistant",
    parts: [
      {
        type: "step-start",
      },
      {
        type: "text",
        text: "I'll search for information about the latest open source GPT models to get you the most current details.",
        state: "done",
      },
      {
        type: "tool-web_search",
        toolCallId: "toolu_01J5yzHsaHim7qjfFQUHZDju",
        state: "output-available",
        input: {
          query: "new open source GPT model 2025",
        },
        output: [
          {
            title: "Introducing gpt-oss | OpenAI",
            url: "https://openai.com/index/introducing-gpt-oss/",
            content:
              "## Introduction\n\nWe’re releasing gpt-oss-120b and gpt-oss-20b—two state-of-the-art open-weight language models that deliver strong real-world performance at low cost. Available under the flexible Apache 2.0 license, these models outperform similarly sized open models on reasoning tasks, demonstrate strong tool use capabilities, and are optimized for efficient deployment on consumer hardware. They were trained using a mix of reinforcement learning and techniques informed by OpenAI’s most advanced internal models, including o3 and other frontier systems.\n\nThe gpt-oss-120b model achieves near-parity with OpenAI o4-mini on core reasoning benchmarks, while running efficiently on a single 80 GB GPU. The gpt-oss-20b model delivers similar results to OpenAI o3‑mini on common benchmarks and can run on edge devices with just 16 GB of memory, making it ideal for on-device use cases, local inference, or rapid iteration without costly infrastructure. Both models also perform strongly on tool use, f",
            publishedDate: "2025-08-05T00:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://openai.com/index/introducing-gpt-oss/",\n  "title": "Introducing gpt-oss | OpenAI",\n  "url": "https://openai.com/index/introducing-gpt-oss/",\n  "publishedDate": "2025-08-05T00:00:00.000Z",\n  "author": "",\n  "text": "## Introduction\\n\\nWe’re releasing gpt-oss-120b and gpt-oss-20b—two state-of-the-art open-weight language models that deliver strong real-world performance at low cost. Available under the flexible Apache 2.0 license, these models outperform similarly sized open models on reasoning tasks, demonstrate strong tool use capabilities, and are optimized for efficient deployment on consumer hardware. They were trained using a mix of reinforcement learning and techniques informed by OpenAI’s most advanced...",\n  "image": "https://images.ctfassets.net/kftzwdyauwt9/1qconCL35vLK9SMASUgpKl/b42ddf6889e3d04edc82d8e12408fcb0/OpenModels_LP_SEO_16x9.png?w=1600&h=900&fit=fill",\n  "favicon": "https://openai.com/favicon.ico"\n}\n```',
          },
          {
            title: "Run OpenAI's new GPT-OSS (open-source) model on Northflank",
            url: "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",
            content:
              "OpenAI just released **GPT-OSS**, its first fully open-source large language model family under an Apache 2.0 license. The release includes two models: **gpt-oss-20b** and **gpt-oss-120b,** designed for fast, low-latency inference with strong reasoning and instruction-following capabilities.\n\nNorthflank makes it simple to deploy and run these models in a secure, high-performance environment.\n\nWith our **[one-click deploy template](https://northflank.com/stacks/gpt-oss-120b)**, you can get started in minutes, without any infrastructure setup required.\n\n**TL;DR**\n\n- OpenAI released **GPT-OSS**, a powerful open-source LLM family under Apache 2.0.\n- The **120B model** delivers top-tier performance and runs smoothly on **2×H100**.\n- You can deploy it in minutes on **Northflank** using our one-click stack with **vLLM + Open WebUI**. No rate limits.\n\n[👉 Deploy GPT-OSS-120B on Northflank now](https://northflank.com/stacks/gpt-oss-120b)\n\n## What is GPT-OSS?\n\n**GPT-OSS** is a new open-source LL",
            publishedDate: "2025-08-05T19:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",\n  "title": "Run OpenAI\'s new GPT-OSS (open-source) model on Northflank",\n  "url": "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",\n  "publishedDate": "2025-08-05T19:00:00.000Z",\n  "author": "",\n  "text": "OpenAI just released **GPT-OSS**, its first fully open-source large language model family under an Apache 2.0 license. The release includes two models: **gpt-oss-20b** and **gpt-oss-120b,** designed for fast, low-latency inference with strong reasoning and instruction-following capabilities.\\n\\nNorthflank makes it simple to deploy and run these models in a secure, high-performance environment.\\n\\nWith our **[one-click deploy template](https://northflank.com/stacks/gpt-oss-120b)**, you can get starte...",\n  "image": "https://assets.northflank.com/gpt_oss_chatgpt_open_source_openai_ffd870725b.png"\n}\n```',
          },
          {
            title:
              "Welcome GPT OSS, the new open-source model family from OpenAI!",
            url: "https://huggingface.co/blog/welcome-openai-gpt-oss",
            content:
              "[Back to Articles](https://huggingface.co/blog)\n\nGPT OSS is a hugely anticipated open-weights release by OpenAI, designed for powerful reasoning, agentic tasks, and versatile developer use cases. It comprises two models: a big one with 117B parameters ( [gpt-oss-120b](https://hf.co/openai/gpt-oss-120b)), and a smaller one with 21B parameters ( [gpt-oss-20b](https://hf.co/openai/gpt-oss-20b)). Both are mixture-of-experts (MoEs) and use a 4-bit quantization scheme (MXFP4), enabling fast inference (thanks to fewer active parameters, see details below) while keeping resource usage low. The large model fits on a single H100 GPU, while the small one runs within 16GB of memory and is perfect for consumer hardware and on-device applications.\n\nTo make it even better and more impactful for the community, the models are licensed under the **Apache 2.0 license**, along with a minimal usage policy:\n\n> We aim for our tools to be used safely, responsibly, and democratically, while maximizing your con",
            publishedDate: "2025-08-05T19:19:09.000Z",
            rawResult:
              '```json\n{\n  "id": "https://huggingface.co/blog/welcome-openai-gpt-oss",\n  "title": "Welcome GPT OSS, the new open-source model family from OpenAI!",\n  "url": "https://huggingface.co/blog/welcome-openai-gpt-oss",\n  "publishedDate": "2025-08-05T19:19:09.000Z",\n  "author": "",\n  "text": "[Back to Articles](https://huggingface.co/blog)\\n\\nGPT OSS is a hugely anticipated open-weights release by OpenAI, designed for powerful reasoning, agentic tasks, and versatile developer use cases. It comprises two models: a big one with 117B parameters ( [gpt-oss-120b](https://hf.co/openai/gpt-oss-120b)), and a smaller one with 21B parameters ( [gpt-oss-20b](https://hf.co/openai/gpt-oss-20b)). Both are mixture-of-experts (MoEs) and use a 4-bit quantization scheme (MXFP4), enabling fast inference ...",\n  "image": "https://huggingface.co/blog/assets/openai/openai-hf-thumbnail.png"\n}\n```',
          },
        ],
      },
      {
        type: "step-start",
      },
      {
        type: "text",
        text: "Based on my search results, I can tell you about OpenAI's new open source models called **GPT-OSS**. However, I need to note that these search results appear to be from August 2025, which is in the future from my knowledge cutoff. Let me search for more current information to verify what's actually available now.",
        state: "done",
      },
      {
        type: "tool-web_search",
        toolCallId: "toolu_01GKoQUGJPhsGviimxixwiBV",
        state: "output-available",
        input: {
          query: "OpenAI GPT-OSS open source model release 2025 verification",
        },
        output: [
          {
            title: "Introducing gpt-oss | OpenAI",
            url: "https://openai.com/index/introducing-gpt-oss/",
            content:
              "## Introduction\n\nWe’re releasing gpt-oss-120b and gpt-oss-20b—two state-of-the-art open-weight language models that deliver strong real-world performance at low cost. Available under the flexible Apache 2.0 license, these models outperform similarly sized open models on reasoning tasks, demonstrate strong tool use capabilities, and are optimized for efficient deployment on consumer hardware. They were trained using a mix of reinforcement learning and techniques informed by OpenAI’s most advanced internal models, including o3 and other frontier systems.\n\nThe gpt-oss-120b model achieves near-parity with OpenAI o4-mini on core reasoning benchmarks, while running efficiently on a single 80 GB GPU. The gpt-oss-20b model delivers similar results to OpenAI o3‑mini on common benchmarks and can run on edge devices with just 16 GB of memory, making it ideal for on-device use cases, local inference, or rapid iteration without costly infrastructure. Both models also perform strongly on tool use, f",
            publishedDate: "2025-08-05T00:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://openai.com/index/introducing-gpt-oss/",\n  "title": "Introducing gpt-oss | OpenAI",\n  "url": "https://openai.com/index/introducing-gpt-oss/",\n  "publishedDate": "2025-08-05T00:00:00.000Z",\n  "author": "",\n  "text": "## Introduction\\n\\nWe’re releasing gpt-oss-120b and gpt-oss-20b—two state-of-the-art open-weight language models that deliver strong real-world performance at low cost. Available under the flexible Apache 2.0 license, these models outperform similarly sized open models on reasoning tasks, demonstrate strong tool use capabilities, and are optimized for efficient deployment on consumer hardware. They were trained using a mix of reinforcement learning and techniques informed by OpenAI’s most advanced...",\n  "image": "https://images.ctfassets.net/kftzwdyauwt9/1qconCL35vLK9SMASUgpKl/b42ddf6889e3d04edc82d8e12408fcb0/OpenModels_LP_SEO_16x9.png?w=1600&h=900&fit=fill",\n  "favicon": "https://openai.com/favicon.svg"\n}\n```',
          },
          {
            title:
              "Welcome GPT OSS, the new open-source model family from OpenAI!",
            url: "https://huggingface.co/blog/welcome-openai-gpt-oss",
            content:
              "[Back to Articles](https://huggingface.co/blog)\n\nGPT OSS is a hugely anticipated open-weights release by OpenAI, designed for powerful reasoning, agentic tasks, and versatile developer use cases. It comprises two models: a big one with 117B parameters ( [gpt-oss-120b](https://hf.co/openai/gpt-oss-120b)), and a smaller one with 21B parameters ( [gpt-oss-20b](https://hf.co/openai/gpt-oss-20b)). Both are mixture-of-experts (MoEs) and use a 4-bit quantization scheme (MXFP4), enabling fast inference (thanks to fewer active parameters, see details below) while keeping resource usage low. The large model fits on a single H100 GPU, while the small one runs within 16GB of memory and is perfect for consumer hardware and on-device applications.\n\nTo make it even better and more impactful for the community, the models are licensed under the **Apache 2.0 license**, along with a minimal usage policy:\n\n> We aim for our tools to be used safely, responsibly, and democratically, while maximizing your con",
            publishedDate: "2025-08-05T19:19:09.000Z",
            rawResult:
              '```json\n{\n  "id": "https://huggingface.co/blog/welcome-openai-gpt-oss",\n  "title": "Welcome GPT OSS, the new open-source model family from OpenAI!",\n  "url": "https://huggingface.co/blog/welcome-openai-gpt-oss",\n  "publishedDate": "2025-08-05T19:19:09.000Z",\n  "author": "",\n  "text": "[Back to Articles](https://huggingface.co/blog)\\n\\nGPT OSS is a hugely anticipated open-weights release by OpenAI, designed for powerful reasoning, agentic tasks, and versatile developer use cases. It comprises two models: a big one with 117B parameters ( [gpt-oss-120b](https://hf.co/openai/gpt-oss-120b)), and a smaller one with 21B parameters ( [gpt-oss-20b](https://hf.co/openai/gpt-oss-20b)). Both are mixture-of-experts (MoEs) and use a 4-bit quantization scheme (MXFP4), enabling fast inference ...",\n  "image": "https://huggingface.co/blog/assets/openai/openai-hf-thumbnail.png"\n}\n```',
          },
          {
            title: "Run OpenAI's new GPT-OSS (open-source) model on Northflank",
            url: "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",
            content:
              "OpenAI just released **GPT-OSS**, its first fully open-source large language model family under an Apache 2.0 license. The release includes two models: **gpt-oss-20b** and **gpt-oss-120b,** designed for fast, low-latency inference with strong reasoning and instruction-following capabilities.\n\nNorthflank makes it simple to deploy and run these models in a secure, high-performance environment.\n\nWith our **[one-click deploy template](https://northflank.com/stacks/gpt-oss-120b)**, you can get started in minutes, without any infrastructure setup required.\n\n**TL;DR**\n\n- OpenAI released **GPT-OSS**, a powerful open-source LLM family under Apache 2.0.\n- The **120B model** delivers top-tier performance and runs smoothly on **2×H100**.\n- You can deploy it in minutes on **Northflank** using our one-click stack with **vLLM + Open WebUI**. No rate limits.\n\n[👉 Deploy GPT-OSS-120B on Northflank now](https://northflank.com/stacks/gpt-oss-120b)\n\n## What is GPT-OSS?\n\n**GPT-OSS** is a new open-source LL",
            publishedDate: "2025-08-05T19:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",\n  "title": "Run OpenAI\'s new GPT-OSS (open-source) model on Northflank",\n  "url": "https://northflank.com/blog/self-host-openai-gpt-oss-120b-open-source-chatgpt",\n  "publishedDate": "2025-08-05T19:00:00.000Z",\n  "author": "",\n  "text": "OpenAI just released **GPT-OSS**, its first fully open-source large language model family under an Apache 2.0 license. The release includes two models: **gpt-oss-20b** and **gpt-oss-120b,** designed for fast, low-latency inference with strong reasoning and instruction-following capabilities.\\n\\nNorthflank makes it simple to deploy and run these models in a secure, high-performance environment.\\n\\nWith our **[one-click deploy template](https://northflank.com/stacks/gpt-oss-120b)**, you can get starte...",\n  "image": "https://assets.northflank.com/gpt_oss_chatgpt_open_source_openai_ffd870725b.png"\n}\n```',
          },
        ],
      },
      {
        type: "step-start",
      },
      {
        type: "text",
        text: "I notice the search results are consistently showing dates from August 2025, which seems unusual since it's currently May 2025. Let me search for the most recent open source GPT models that are actually available now.",
        state: "done",
      },
      {
        type: "tool-web_search",
        toolCallId: "toolu_01Buwu2AGxJim3WXcq4GDa2p",
        state: "output-available",
        input: {
          query: '"latest open source GPT models" May 2025',
        },
        output: [
          {
            title: "Top 10 Open Source AI Models You Must Know in 2025",
            url: "https://www.orionai.asia/blog/top-open-llms",
            content:
              "In the evolving AI landscape of 2025, open-source AI models are taking center stage. They offer transparency, cost savings, and customization that proprietary models can’t match. From trillion-parameter research projects to community-built chatbots, these top models represent the cutting edge of open AI. Below are ten influential open-source LLMs developers and researchers should know, along with their key details and use cases.\n\n## **Meta LLaMA 4 (2025, Meta AI)**\n\nThe latest in Meta AI’s LLaMA family, LLaMA 4 brings ultra-large-scale language understanding to the open-source world. Released in 2025, LLaMA 4 includes models with up to two trillion parameters, dramatically increasing its reasoning and generation capabilities. It supports tasks ranging from multilingual chat to code generation (via Code LLaMA). Instruction-tuned variants (chat models) are available alongside the base models.\n\n- **Release Year & Org:** 2025, Meta AI\n- **Parameter Count:** Up to ~2 trillion (largest LLaMA",
            publishedDate: "2025-07-12T12:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://www.orionai.asia/blog/top-open-llms",\n  "title": "Top 10 Open Source AI Models You Must Know in 2025",\n  "url": "https://www.orionai.asia/blog/top-open-llms",\n  "publishedDate": "2025-07-12T12:00:00.000Z",\n  "author": "OrionAI",\n  "text": "In the evolving AI landscape of 2025, open-source AI models are taking center stage. They offer transparency, cost savings, and customization that proprietary models can’t match. From trillion-parameter research projects to community-built chatbots, these top models represent the cutting edge of open AI. Below are ten influential open-source LLMs developers and researchers should know, along with their key details and use cases.\\n\\n## **Meta LLaMA 4 (2025, Meta AI)**\\n\\nThe latest in Meta AI’s LLaMA...",\n  "image": "https://theorionai.com/blog/open-llms-2025-cover.png",\n  "favicon": "https://www.orionai.asia/favicon_32x32.ico"\n}\n```',
          },
          {
            title:
              "Google Gemma 3: The Best Open AI Model for Developers in 2025?",
            url: "https://nexcrestit.com/google-gemma-3-best-open-ai-model-2025/",
            content:
              "## Google Gemma 3: The Best Open AI Model for Developers in 2025?\n\nMay 19, 2025\n\n## **Introduction**\n\nGoogle’s **Gemma 3** (released March 2025) is making waves as a **lightweight, open-weight AI model** that balances performance and accessibility. Designed for developers, it supports **multimodal tasks, 140+ languages, and runs on consumer GPUs**—but does it outshine competitors like **GPT-4, Llama 3, and Mistral**? Let’s dive in.\n\n_(For a timeline of Google’s AI releases, check our guide: [The Evolution of Open-Source AI](https://nexcrestit.com/open-ai-evolution).)_\n\n* * *\n\n## **Why Gemma 3 Stands Out**\n\n### **1\\. Unmatched Efficiency**\n\n- **Runs on a single GPU/TPU**: The 27B model delivers top-tier performance (Chatbot Arena Elo: 1338) with just **one NVIDIA H100**, while rivals need 32 GPUs.\n- **Quantized versions**: 4-bit models reduce VRAM usage by **75%** (e.g., 27B drops from 54GB to 14.1GB), enabling local deployment on **RTX 3090s or laptops**.\n\n### **2\\. Multimodal & Multil",
            publishedDate: "2025-05-19T04:20:05.000Z",
            rawResult:
              '```json\n{\n  "id": "https://nexcrestit.com/google-gemma-3-best-open-ai-model-2025/",\n  "title": "Google Gemma 3: The Best Open AI Model for Developers in 2025?",\n  "url": "https://nexcrestit.com/google-gemma-3-best-open-ai-model-2025/",\n  "publishedDate": "2025-05-19T04:20:05.000Z",\n  "author": "nexcrestit@gmail.com",\n  "text": "## Google Gemma 3: The Best Open AI Model for Developers in 2025?\\n\\nMay 19, 2025\\n\\n## **Introduction**\\n\\nGoogle’s **Gemma 3** (released March 2025) is making waves as a **lightweight, open-weight AI model** that balances performance and accessibility. Designed for developers, it supports **multimodal tasks, 140+ languages, and runs on consumer GPUs**—but does it outshine competitors like **GPT-4, Llama 3, and Mistral**? Let’s dive in.\\n\\n_(For a timeline of Google’s AI releases, check our guide: [The...",\n  "image": "https://nexcrestit.com/wp-content/uploads/2025/05/115c3fd0276758b599ca10e555b0d2a2.png",\n  "favicon": "https://nexcrestit.com/wp-content/uploads/2024/11/nexcrest-Icon-150x150.png"\n}\n```',
          },
          {
            title: "Qwen3: The Next Evolution in AI Language Models",
            url: "https://dev.to/czmilo/qwen3-the-next-evolution-in-ai-language-models-2ife",
            content:
              "_May 3, 2025 · 8 min read_\n\n[Qwen3](https://qwq32.com/qwen3) has officially launched, bringing an impressive new suite of language models that push the boundaries of AI capabilities. The newly released Qwen3 family represents a significant leap forward in both thinking capacity and response speed, offering unprecedented flexibility for developers and users alike.\n\n## The New Qwen3 Lineup\n\nThe Qwen team has unveiled an extensive collection of models to suit various needs and computational resources:\n\n**MoE (Mixture of Experts) Models:**\n\n- **Qwen3-235B-A22B**: The flagship model with 235 billion total parameters and 22 billion activated parameters\n- **Qwen3-30B-A3B**: A smaller but powerful MoE model with 30 billion total parameters and 3 billion activated parameters\n\n**Dense Models:**\n\n- **Qwen3-32B**\n- **Qwen3-14B**\n- **Qwen3-8B**\n- **Qwen3-4B**\n- **Qwen3-1.7B**\n- **Qwen3-0.6B**\n\nAll dense models are available under the Apache 2.0 license, making them accessible for commercial and res",
            publishedDate: "2025-04-28T23:39:51.000Z",
            rawResult:
              '```json\n{\n  "id": "https://dev.to/czmilo/qwen3-the-next-evolution-in-ai-language-models-2ife",\n  "title": "Qwen3: The Next Evolution in AI Language Models",\n  "url": "https://dev.to/czmilo/qwen3-the-next-evolution-in-ai-language-models-2ife",\n  "publishedDate": "2025-04-28T23:39:51.000Z",\n  "author": "cz",\n  "text": "_May 3, 2025 · 8 min read_\\n\\n[Qwen3](https://qwq32.com/qwen3) has officially launched, bringing an impressive new suite of language models that push the boundaries of AI capabilities. The newly released Qwen3 family represents a significant leap forward in both thinking capacity and response speed, offering unprecedented flexibility for developers and users alike.\\n\\n## The New Qwen3 Lineup\\n\\nThe Qwen team has unveiled an extensive collection of models to suit various needs and computational resourc...",\n  "image": "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fcz61tzwngsist0sp5ew3.png",\n  "favicon": "https://media2.dev.to/dynamic/image/width%3D32%2Cheight%3D%2Cfit%3Dscale-down%2Cgravity%3Dauto%2Cformat%3Dauto/https%3A//dev-to-uploads.s3.amazonaws.com/uploads/articles/8j7kvp660rqzt99zui8e.png"\n}\n```',
          },
        ],
      },
      {
        type: "step-start",
      },
      {
        type: "text",
        text: "I'm getting some inconsistent information about future releases. Let me search for what's actually available right now as of May 2025.",
        state: "done",
      },
      {
        type: "tool-web_search",
        toolCallId: "toolu_01Qyd61VLQrSpuhazj85kKWK",
        state: "output-available",
        input: {
          query: "current open source language models available now 2025",
        },
        output: [
          {
            title: "Top 10 open source LLMs for 2025 - NetApp Instaclustr",
            url: "https://www.instaclustr.com/education/open-source-ai/top-10-open-source-llms-for-2025/",
            content:
              "Large Language Models (LLMs) are machine learning models that can understand and generate human language based on large-scale datasets.\n\n## What are open source LLMs?\n\nLarge Language Models (LLMs) are machine learning models that can understand and generate human language based on large-scale datasets. Unlike proprietary models developed by companies like OpenAI and Google, open source LLMs are licensed to be freely used, modified, and distributed by anyone. They offer transparency and flexibility, which can be particularly useful for research, development, and customization in various applications.\n\nResearchers and developers can access the underlying code, training mechanisms, and datasets, enabling them to deeply understand and improve these models. This openness fosters a community-driven approach to innovation, which can lead to rapid advancements not possible with closed source models.\n\nThis is part of a series of articles about open source AI.\n\n## Open source vs closed source LL",
            publishedDate: "2025-08-06T15:08:15.000Z",
            rawResult:
              '```json\n{\n  "id": "https://www.instaclustr.com/education/open-source-ai/top-10-open-source-llms-for-2025/",\n  "title": "Top 10 open source LLMs for 2025 - NetApp Instaclustr",\n  "url": "https://www.instaclustr.com/education/open-source-ai/top-10-open-source-llms-for-2025/",\n  "publishedDate": "2025-08-06T15:08:15.000Z",\n  "author": "",\n  "text": "Large Language Models (LLMs) are machine learning models that can understand and generate human language based on large-scale datasets.\\n\\n## What are open source LLMs?\\n\\nLarge Language Models (LLMs) are machine learning models that can understand and generate human language based on large-scale datasets. Unlike proprietary models developed by companies like OpenAI and Google, open source LLMs are licensed to be freely used, modified, and distributed by anyone. They offer transparency and flexibili...",\n  "image": "https://www.instaclustr.com/wp-content/uploads/Insta_Website_Social-Share-Thumbnail_rebrand.png",\n  "favicon": "https://www.instaclustr.com/wp-content/uploads/cropped-netapp_favicon-32x32.png"\n}\n```',
          },
          {
            title: "Horizon Model Review - Barnacle Goose - Medium",
            url: "https://medium.com/@leucopsis/horizon-model-review-e826fe829757",
            content:
              "_Updated August 4th, 2025_\n\nA mysterious new AI model series called [Horizon](https://gptchatly.com/horizon-beta.html) has just been released for public evaluation. Appearing without announcement on the OpenRouter platform in late July 2025, Horizon Alpha, and its quickly succeeding upgrade, [Horizon Beta](https://gptchatly.com/horizon-beta.html) have surprised experts with capabilities that rival well-known models like OpenAI’s GPT4 and Anthropic’s Claude 4. Is it an open-source/-weight model Sam Altman’s promised in his “heat waves” tweet? Or a preview of another model (GPT5, Sonnet 4.5) from an established organisation? Or a completley new contender?\n\nThe Beta model is currently offered free of charge _during the test period_, prompting experimentation among coders, designers, and AI enthusiasts that is partially covered here. My own experimentation with vanilla-JS-based app was not very productive.\n\nHorizon models combine a decent context windows, blazing-fast generation, and good ",
            publishedDate: "2025-08-04T16:59:18.000Z",
            rawResult:
              '```json\n{\n  "id": "https://medium.com/@leucopsis/horizon-model-review-e826fe829757",\n  "title": "Horizon Model Review - Barnacle Goose - Medium",\n  "url": "https://medium.com/@leucopsis/horizon-model-review-e826fe829757",\n  "publishedDate": "2025-08-04T16:59:18.000Z",\n  "author": "Barnacle Goose",\n  "text": "_Updated August 4th, 2025_\\n\\nA mysterious new AI model series called [Horizon](https://gptchatly.com/horizon-beta.html) has just been released for public evaluation. Appearing without announcement on the OpenRouter platform in late July 2025, Horizon Alpha, and its quickly succeeding upgrade, [Horizon Beta](https://gptchatly.com/horizon-beta.html) have surprised experts with capabilities that rival well-known models like OpenAI’s GPT4 and Anthropic’s Claude 4. Is it an open-source/-weight model S...",\n  "image": "https://miro.medium.com/v2/resize:fit:490/1*haFQoSlhwvSxmcyxOAJ3Lw.jpeg",\n  "favicon": "https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19"\n}\n```',
          },
          {
            title:
              "Meet GLM-4.5: The Open-Source LLM That’s Challenging the Best",
            url: "https://medium.com/@rameshkannanyt0078/meet-glm-4-5-the-open-source-llm-thats-challenging-the-best-a0bc3fe742ea",
            content:
              "The open-source AI space has been moving fast — almost too fast to follow. Just when we were getting comfortable with LLaMA, Mistral, and the likes, another serious contender has entered the ring: **GLM-4.5**, the latest large language model from the **THUDM** team (Tsinghua University’s NLP group), and it’s making waves for all the right reasons.\n\nIf you’re a developer, researcher, or just an AI enthusiast, GLM-4.5 might be the open-source model you’ve been waiting for.\n\n## So, What Is GLM-4.5?\n\nGLM-4.5 is a **multilingual, multimodal, and multi-task** language model designed to rival proprietary models like OpenAI’s GPT-4. But here’s the kicker — **it’s open-source** and packs a serious punch when it comes to performance, especially in understanding and generating text across languages and formats.\n\nIt builds on its predecessor GLM-4, bringing improved reasoning, stronger multilingual support, and **impressive long-context capabilities** — up to 1 million tokens using FlashAttention-",
            publishedDate: "2025-08-02T04:46:54.000Z",
            rawResult:
              '```json\n{\n  "id": "https://medium.com/@rameshkannanyt0078/meet-glm-4-5-the-open-source-llm-thats-challenging-the-best-a0bc3fe742ea",\n  "title": "Meet GLM-4.5: The Open-Source LLM That’s Challenging the Best",\n  "url": "https://medium.com/@rameshkannanyt0078/meet-glm-4-5-the-open-source-llm-thats-challenging-the-best-a0bc3fe742ea",\n  "publishedDate": "2025-08-02T04:46:54.000Z",\n  "author": "Ramesh Kannan s",\n  "text": "The open-source AI space has been moving fast — almost too fast to follow. Just when we were getting comfortable with LLaMA, Mistral, and the likes, another serious contender has entered the ring: **GLM-4.5**, the latest large language model from the **THUDM** team (Tsinghua University’s NLP group), and it’s making waves for all the right reasons.\\n\\nIf you’re a developer, researcher, or just an AI enthusiast, GLM-4.5 might be the open-source model you’ve been waiting for.\\n\\n## So, What Is GLM-4.5?...",\n  "image": "https://miro.medium.com/v2/da:true/bc1f8416df0cad099e43cda2872716e5864f18a73bda2a7547ea082aca9b5632",\n  "favicon": "https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19"\n}\n```',
          },
        ],
      },
      {
        type: "step-start",
      },
      {
        type: "text",
        text: "I'm noticing that many of these search results are showing dates from the future (August 2025), which suggests these may not be accurate current information. Let me search for verifiable open source models that are actually available now.",
        state: "done",
      },
      {
        type: "tool-web_search",
        toolCallId: "toolu_01AXKpj2cVwwW7V5waQkB7EC",
        state: "output-available",
        input: {
          query: "Llama 3 Mistral open source models currently available",
        },
        output: [
          {
            title: "Mistral Small 3 | Mistral AI",
            url: "https://mistral.ai/news/mistral-small-3",
            content:
              "Today we’re introducing Mistral Small 3, a latency-optimized 24B-parameter model released under the Apache 2.0 license.\n\nMistral Small 3 is competitive with larger models such as Llama 3.3 70B or Qwen 32B, and is an excellent open replacement for opaque proprietary models like GPT4o-mini. Mistral Small 3 is on par with Llama 3.3 70B instruct, while being more than 3x faster on the same hardware.\n\nMistral Small 3 is a pre-trained and instructed model catered to the ‘80%’ of generative AI tasks—those that require robust language and instruction following performance, with very low latency.\n\nWe designed this new model to saturate performance at a size suitable for local deployment. Particularly, Mistral Small 3 has far fewer layers than competing models, substantially reducing the time per forward pass. At over 81% accuracy on MMLU and 150 tokens/s latency, Mistral Small is currently the most efficient model of its category.\n\nWe’re releasing both a pretrained and instruction-tuned checkpo",
            publishedDate: "2025-01-17T08:42:04.000Z",
            rawResult:
              '```json\n{\n  "id": "https://mistral.ai/news/mistral-small-3",\n  "title": "Mistral Small 3 | Mistral AI",\n  "url": "https://mistral.ai/news/mistral-small-3",\n  "publishedDate": "2025-01-17T08:42:04.000Z",\n  "author": "",\n  "text": "Today we’re introducing Mistral Small 3, a latency-optimized 24B-parameter model released under the Apache 2.0 license.\\n\\nMistral Small 3 is competitive with larger models such as Llama 3.3 70B or Qwen 32B, and is an excellent open replacement for opaque proprietary models like GPT4o-mini. Mistral Small 3 is on par with Llama 3.3 70B instruct, while being more than 3x faster on the same hardware.\\n\\nMistral Small 3 is a pre-trained and instructed model catered to the ‘80%’ of generative AI tasks—th...",\n  "image": "https://mistral.ai/img/mistral-cover.png",\n  "favicon": "https://mistral.ai/favicon.ico"\n}\n```',
          },
          {
            title: "Introducing Meta Llama 3: The most capable openly ...",
            url: "https://ai.meta.com/blog/meta-llama-3/",
            content:
              "## Takeaways:\n\nRECOMMENDED READS\n\n- [5 Steps to Getting Started with Llama 2](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/)\n- [The Llama Ecosystem: Past, Present, and Future](https://ai.meta.com/blog/llama-2-updates-connect-2023/)\n- [Introducing Code Llama, a state-of-the-art large language model for coding](https://ai.meta.com/blog/code-llama-large-language-model-coding/)\n- [Meta and Microsoft Introduce the Next Generation of Llama](https://ai.meta.com/blog/llama-2/)\n\n- Today, we’re introducing Meta Llama 3, the next generation of our state-of-the-art open source large language model.\n- Llama 3 models will soon be available on AWS, Databricks, Google Cloud, Hugging Face, Kaggle, IBM WatsonX, Microsoft Azure, NVIDIA NIM, and Snowflake, and with support from hardware platforms offered by AMD, AWS, Dell, Intel, NVIDIA, and Qualcomm.\n- We’re dedicated to developing Llama 3 in a responsible way, and we’re offering various resources to help others use it responsibly as ",
            publishedDate: "2024-04-18T00:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://ai.meta.com/blog/meta-llama-3/",\n  "title": "Introducing Meta Llama 3: The most capable openly ...",\n  "url": "https://ai.meta.com/blog/meta-llama-3/",\n  "publishedDate": "2024-04-18T00:00:00.000Z",\n  "author": "",\n  "text": "## Takeaways:\\n\\nRECOMMENDED READS\\n\\n- [5 Steps to Getting Started with Llama 2](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/)\\n- [The Llama Ecosystem: Past, Present, and Future](https://ai.meta.com/blog/llama-2-updates-connect-2023/)\\n- [Introducing Code Llama, a state-of-the-art large language model for coding](https://ai.meta.com/blog/code-llama-large-language-model-coding/)\\n- [Meta and Microsoft Introduce the Next Generation of Llama](https://ai.meta.com/blog/llama-2/)\\n\\n- Tod...",\n  "image": "https://scontent-sea1-1.xx.fbcdn.net/v/t39.2365-6/438904118_1185694632845028_8008633574873659221_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=LfuFWF0YK5wQ7kNvwFNgFaN&_nc_oc=AdlnPQ6gh7PgNh2Us2dL5ZQbx_pnVD_8jtKMAFXPja65lFYa0PVB2WKAXyAOyr9duIyScIZzYRUYBgLbfNofoxZg&_nc_zt=14&_nc_ht=scontent-sea1-1.xx&_nc_gid=MCRF6AF41HqWGV5GS1cA_A&oh=00_AfVrT0OjBk35MqZ-DKtvirOxlTHZRILKVmXxBWKV7oH4rg&oe=68AE3F40",\n  "favicon": "https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/WUJbsVI4ruF.png"\n}\n```',
          },
          {
            title: "Models Overview",
            url: "https://docs.mistral.ai/getting-started/models/models_overview/",
            content:
              "Mistral provides two types of models: open models and premier models.\n\nnote\n\n- For API pricing details, please visit our [pricing page](https://mistral.ai/pricing#api-pricing).\n- If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/en/contact).\n\n### Premier models [​](http://docs.mistral.ai/docs.mistral.ai\\#premier-models)\n\n| Model | Weight availability | Available via API | Description | Max Tokens | API Endpoints | Version |\n| --- | --- | --- | --- | --- | --- | --- |\n| Mistral Medium 3 | | ✔️ | Our frontier-class multimodal model released May 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-medium-3/) | 128k | `mistral-medium-2505` | 25.05 |\n| Magistral Medium 1.1 | | ✔️ | Our frontier-class reasoning model released July 2025. | 40k | `magistral-medium-2507` | 25.07 |\n| Codestral 2508 | | ✔️ | Our cutting-edge language model for coding released end of July 2025, Codestral specializes in low-latency, ",
            publishedDate: "2026-03-31T00:00:00.000Z",
            rawResult:
              '```json\n{\n  "id": "https://docs.mistral.ai/getting-started/models/models_overview/",\n  "title": "Models Overview",\n  "url": "https://docs.mistral.ai/getting-started/models/models_overview/",\n  "publishedDate": "2026-03-31T00:00:00.000Z",\n  "author": "",\n  "text": "Mistral provides two types of models: open models and premier models.\\n\\nnote\\n\\n- For API pricing details, please visit our [pricing page](https://mistral.ai/pricing#api-pricing).\\n- If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/en/contact).\\n\\n### Premier models [​](http://docs.mistral.ai/docs.mistral.ai\\\\#premier-models)\\n\\n| Model | Weight availability | Available via API | Description | Max Tokens | API Endpoints | Version |\\n| --...",\n  "image": "https://docs.mistral.ai/img/mistral-social-banner.jpg",\n  "favicon": "https://docs.mistral.ai/img/favicon.ico"\n}\n```',
          },
        ],
      },
    ],
  },
];

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [overflowFiles, setOverflowFiles] = useState<OverflowFile[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [reasoningStates, setReasoningStates] = useState<
    Record<string, { isCollapsed: boolean; thinkingTime: number }>
  >({});
  const [currentArtifact, setCurrentArtifact] = useState<any>(null);
  const [showArtifactPanel, setShowArtifactPanel] = useState(false);
  const [chatPanelSize, setChatPanelSize] = useState(100);
  const [artifactPanelSize, setArtifactPanelSize] = useState(50);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const { sendMessage, status, stop, regenerate } =
    useChat<UIMessageWithMetadata>({
      chat,
      experimental_throttle: 50,
    });

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Constants for overflow detection
  const MAX_CHARS = 2000;
  const MAX_WORDS = 400;

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };

  const createOverflowFile = (content: string): OverflowFile => {
    return {
      id: generateId(),
      content,
      wordCount: countWords(content),
      charCount: content.length,
      createdAt: new Date(),
    };
  };

  const handleTextOverflow = (
    text: string
  ): { shouldCreateFile: boolean; truncatedText: string } => {
    const wordCount = countWords(text);
    const charCount = text.length;

    if (charCount > MAX_CHARS || wordCount > MAX_WORDS) {
      // Create overflow file with the excess content
      const overflowContent = text;
      const newOverflowFile = createOverflowFile(overflowContent);

      setOverflowFiles((prev) => [...prev, newOverflowFile]);

      // Return empty text to clear the textarea
      return { shouldCreateFile: true, truncatedText: "" };
    }

    return { shouldCreateFile: false, truncatedText: text };
  };

  const removeOverflowFile = (id: string) => {
    setOverflowFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleArtifactDetected = useCallback(() => {
    console.log("Artifact opening tag detected - triggering panel early"); // Debug log
    setShowArtifactPanel(true);
    setChatPanelSize(60); // Resize chat panel immediately when opening tag is detected
  }, []);

  const handlePartialArtifact = useCallback((partialArtifact: any) => {
    console.log("Partial artifact streaming:", partialArtifact); // Debug log
    setCurrentArtifact(partialArtifact);
  }, []);

  const handleArtifactFound = useCallback((artifact: any) => {
    console.log("Artifact found:", artifact); // Debug log
    setCurrentArtifact(artifact);
    // Panel is already open from handleArtifactDetected, just set the final artifact
  }, []);

  const toggleReasoning = (messageId: string, partIndex: number) => {
    const key = `${messageId}-${partIndex}`;
    setReasoningStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isCollapsed: !prev[key]?.isCollapsed,
      },
    }));
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get accurate scrollHeight
      textarea.style.height = "auto";

      // Calculate new height with min/max constraints
      const minHeight = messages.length === 0 ? 120 : 112; // h-32 = 8rem = 128px, h-28 = 7rem = 112px
      const maxHeight = 200; // Maximum height in pixels
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );

      textarea.style.height = `${newHeight}px`;
    }
  }, [textareaValue, messages.length]);

  // Initialize reasoning state without auto-collapse
  useEffect(() => {
    messages.forEach((message) => {
      if (message.role === "assistant") {
        message.parts.forEach((part, partIndex) => {
          if (part.type === "reasoning" && part.state === "done") {
            const key = `${message.id}-${partIndex}`;
            if (!reasoningStates[key]) {
              setReasoningStates((prev) => ({
                ...prev,
                [key]: { isCollapsed: false, thinkingTime: 0 },
              }));
            }
          }
        });
      }
    });
  }, [messages, reasoningStates]);

  useHotkeys(
    "slash",
    () => {
      textareaRef.current?.focus();
    },
    {
      preventDefault: true,
    }
  );

  useHotkeys(
    "enter",
    () => {
      if (textareaValue.trim()) {
        sendMessage(
          {
            text: textareaValue,
          },
          {
            body: {
              selectedModel,
              enabledTools,
            },
          }
        );
        setTextareaValue("");
        setOverflowFiles([]);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "backspace",
    () => {
      if (!textareaValue.trim()) {
        if (overflowFiles.length > 0) {
          setOverflowFiles((prev) => prev.slice(0, -1));
        } else {
          textareaRef.current?.blur();
        }
      }
    },
    {
      preventDefault: false,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "meta+z",
    () => {
      if (overflowFiles.length > 0) {
        setOverflowFiles((prev) => prev.slice(0, -1));
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "esc",
    () => {
      textareaRef.current?.blur();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    }
  );

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn(
        "h-screen w-full",
        !showArtifactPanel && "max-w-screen-md mx-auto border-x border-dashed"
      )}
    >
      {/* Main Chat Panel */}
      <ResizablePanel
        defaultSize={showArtifactPanel ? chatPanelSize : 100}
        minSize={showArtifactPanel ? 40 : 100}
        onResize={setChatPanelSize}
      >
        <main
          className={cn(
            messages.length === 0 ? "pt-10 md:pt-50" : "",
            messages.length === 0 && "no-overflow",
            "h-full",
            showArtifactPanel ? "px-2" : ""
          )}
        >
          {messages.length === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-medium tracking-tight font-mono">
                ai playground
              </h1>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Sometimes I run into Claude rate limits. I also wanted to see
                how far I could go with creating custom tools for Claude while
                experimenting with the{" "}
                <Link
                  href="https://sdk.vercel.ai/"
                  target="_blank"
                  className="text-nowrap text-foreground/85 hover:text-foreground transition-colors duration-200"
                >
                  Vercel AI SDK
                </Link>
                .
              </p>
            </div>
          )}
          <div
            className={cn(
              !showArtifactPanel && "max-w-2xl mx-auto",
              "mx-auto px-4",
              messages.length === 0 && "mt-12"
            )}
          >
            {messages.length ? (
              <ScrollArea className="h-[calc(100vh-185px)] overflow-hidden">
                <div className="space-y-3 pb-8 pt-10">
                  <div className="bg-gradient-to-b from-background/95 via-background/85 to-transparent w-full h-14 absolute top-0 left-0 right-0 z-10" />
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, messageIndex) =>
                      message.role === "user" ? (
                        <div key={message.id}>
                          {message.parts.map((part, i) => (
                            <div
                              key={`${message.id}-${i}`}
                              className="bg-muted/50 px-3.5 py-3 rounded-lg text-sm"
                            >
                              {part.type === "text" ? part.text : part.type}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          key={message.id}
                          initial={{
                            opacity: 0,
                            filter: "blur(8px)",
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            filter: "blur(4px)",
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1],
                            delay: messageIndex * 0.1,
                          }}
                        >
                          <AnimatePresence mode="popLayout">
                            {message.parts.map((part, i) => {
                              switch (part.type) {
                                case "text":
                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      className="px-3.5 py-1.5 opacity-80 group"
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(12px)",
                                        y: 5,
                                      }}
                                      animate={{
                                        opacity: 0.8,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: i * 0.05,
                                      }}
                                    >
                                      <StreamingMarkdown
                                        key={`${message.id}-${i}`}
                                        content={part.text}
                                        onArtifactFound={handleArtifactFound}
                                        onArtifactDetected={
                                          handleArtifactDetected
                                        }
                                        onPartialArtifact={
                                          handlePartialArtifact
                                        }
                                      />
                                      <div
                                        className={cn(
                                          "flex justify-end mt-2 transition-all duration-200 opacity-0",
                                          i === message.parts.length - 1 &&
                                            messageIndex === messages.length - 1
                                            ? "opacity-100"
                                            : "group-hover:opacity-100"
                                        )}
                                      >
                                        <span className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(
                                                      part.text
                                                    );
                                                  }}
                                                >
                                                  <CopyIcon className="size-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent side="bottom">
                                                Copy
                                              </TooltipContent>
                                            </Tooltip>
                                            <Separator
                                              orientation="vertical"
                                              className="!h-5"
                                            />
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7"
                                                  onClick={() => {
                                                    regenerate({
                                                      headers: {},
                                                      body: {
                                                        selectedModel,
                                                        enabledTools,
                                                      },
                                                    });
                                                  }}
                                                >
                                                  <RotateCcwIcon className="size-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent side="bottom">
                                                Regenerate response
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </span>
                                      </div>
                                    </motion.div>
                                  );
                                case "tool-web_search":
                                  return (
                                    <motion.div
                                      key={message.id}
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(8px)",
                                        y: 20,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      exit={{
                                        opacity: 0,
                                        filter: "blur(4px)",
                                        transition: { duration: 0.2 },
                                      }}
                                      transition={{
                                        duration: 0.6,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: messageIndex * 0.1,
                                      }}
                                    >
                                      <Accordion
                                        type="single"
                                        collapsible
                                        className="my-2"
                                      >
                                        <AccordionItem
                                          value="reasoning"
                                          className="border-0"
                                        >
                                          <AccordionTrigger
                                            onClick={() =>
                                              toggleReasoning(message.id, i)
                                            }
                                            className="text-muted-foreground px-3.5 py-2.5 font-normal text-sm hover:no-underline border rounded-lg bg-accent/20 hover:bg-accent/30 hover:text-accent-foreground !border-dashed transition-all duration-200 [&[data-state=open]]:border-solid [&[data-state=open]]:bg-accent/20"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-2">
                                                <motion.div className="size-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-sm">
                                                  {part.state ===
                                                  "output-available"
                                                    ? "Search Results"
                                                    : "Scouring the web..."}
                                                </span>
                                              </div>
                                              {/* <div className="flex items-center gap-0.5 text-muted-foreground/60">
                                              <ClockFadingIcon className="size-3" />
                                              {part.state === "done" && (
                                                <div className="text-xs font-mono">
                                                  {calculateReasoningTime(
                                                    message
                                                  ) ||
                                                    `${Math.round(
                                                      part.text.length / 20
                                                    )}s`}
                                                </div>
                                              )}
                                            </div> */}
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="pointer-events-none px-3.5 py-3 bg-input/30 rounded-lg border border-dashed">
                                            <div className="">
                                              <div className="text-muted-foreground font-mono uppercase text-[0.65rem] tracking-widest">
                                                Query
                                              </div>
                                              <div className="font-mono bg-accent text-accent-foreground px-3 py-2.5 rounded-md mt-1 text-xs">
                                                {part.input?.query}
                                              </div>
                                            </div>
                                            <div className="mt-3">
                                              <div className="text-muted-foreground font-mono uppercase text-[0.65rem] tracking-widest">
                                                Results
                                              </div>
                                              <div className="bg-accent px-3 py-2.5 rounded-md mt-1 text-xs">
                                                {part.output?.map((result) => (
                                                  <ReactMarkdown>
                                                    {result.rawResult}
                                                  </ReactMarkdown>
                                                ))}
                                                {/* {
            title: "Introducing gpt-oss | OpenAI",
            url: "https://openai.com/index/introducing-gpt-oss/",
            content:
              "## Introduction\n\nWe’re releasing gpt-oss-120b and gpt-oss-20b—two state-of-the-art open-weight language models that deliver strong real-world performance at low cost. Available under the flexible Apache 2.0 license, these models outperform similarly sized open models on reasoning tasks, demonstrate strong tool use capabilities, and are optimized for efficient deployment on consumer hardware. They were trained using a mix of reinforcement learning and techniques informed by OpenAI’s most advanced internal models, including o3 and other frontier systems.\n\nThe gpt-oss-120b model achieves near-parity with OpenAI o4-mini on core reasoning benchmarks, while running efficiently on a single 80 GB GPU. The gpt-oss-20b model delivers similar results to OpenAI o3‑mini on common benchmarks and can run on edge devices with just 16 GB of memory, making it ideal for on-device use cases, local inference, or rapid iteration without costly infrastructure. Both models also perform strongly on tool use, f",
            publishedDate: "2025-08-05T00:00:00.000Z",
          },
          {
            title:
              "OpenAI launches two 'open' AI reasoning models | TechCrunch",
            url: "https://techcrunch.com/2025/08/05/openai-launches-two-open-ai-reasoning-models/",
            content:
              "OpenAI announced Tuesday the launch of two open-weight AI reasoning models with similar capabilities [to its o-series](https://techcrunch.com/2024/12/20/openai-announces-new-o3-model/). Both are freely available to download from the online developer platform [Hugging Face](https://huggingface.co/), the company said, describing the models as “state of the art” when measured across several benchmarks for comparing open models.\n\nThe models come in two sizes: a larger and more capable gpt-oss-120b model that can run on a single Nvidia GPU, and a lighter-weight gpt-oss-20b model that can run on a consumer laptop with 16GB of memory.\n\nThe launch marks OpenAI’s first ‘open’ language model since [GPT-2](https://techcrunch.com/2019/02/17/openai-text-generator-dangerous/), which was released more than five years ago.\n\nIn a briefing, OpenAI said its open models will be capable of sending complex queries to [AI models in the cloud,](https://techcrunch.com/2025/04/24/openai-wants-its-open-ai-model-",
            publishedDate: "2025-08-05T00:00:00.000Z",
          },
          {
            title: "Open models by OpenAI",
            url: "https://openai.com/open-models/",
            content:
              "OpenAI\n\nAdvanced open-weight reasoning models to customize for any use case and run anywhere.\n\n#### Permissive license\n\nThese models are supported by the Apache 2.0 license. Build freely without worrying about copyleft restrictions or patent risk—whether you're experimenting, customizing, or deploying commercially.\n\n#### Designed for agentic tasks\n\nLeverage powerful instruction following and tool use within the chain-of-thought, including web search and Python code execution.\n\n#### Deeply customizable\n\nAdjust the reasoning effort to low, medium, or high. Plus, customize the models to adapt to your use case with full-parameter fine-tuning.\n\n#### Full chain-of-thought\n\nAccess the full chain-of-thought for easier debugging and higher trust in model outputs.\n\n## Model performance\n\n## Advancing safety standards for open models\n\n#### Safety is foundational to our open models\n\nEach model has completed thorough safety training and evaluation to help developers keep users safe.\n\n#### Comprehens",
            publishedDate: "2015-01-01T00:00:00.000Z",
          }, */}
                                              </div>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </motion.div>
                                  );
                                case "reasoning": {
                                  const reasoningKey = `${message.id}-${i}`;
                                  const reasoningState =
                                    reasoningStates[reasoningKey];
                                  const isCollapsed =
                                    reasoningState?.isCollapsed ?? false;

                                  return (
                                    <motion.div
                                      key={`${message.id}-${i}`}
                                      initial={{
                                        opacity: 0,
                                        filter: "blur(6px)",
                                        y: 15,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        y: 0,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: 0.3,
                                      }}
                                      className="mb-2"
                                    >
                                      <Accordion
                                        type="single"
                                        collapsible
                                        value={isCollapsed ? "" : "reasoning"}
                                      >
                                        <AccordionItem
                                          value="reasoning"
                                          className="border-0"
                                        >
                                          <AccordionTrigger
                                            onClick={() =>
                                              toggleReasoning(message.id, i)
                                            }
                                            className="text-muted-foreground px-3.5 py-2.5 font-normal text-sm hover:no-underline border rounded-lg bg-accent/20 hover:bg-accent/30 hover:text-accent-foreground !border-dashed transition-all duration-200 [&[data-state=open]]:border-solid [&[data-state=open]]:bg-accent/20"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-2">
                                                <motion.div
                                                  animate={{
                                                    rotate:
                                                      part.state === "done"
                                                        ? 0
                                                        : 360,
                                                    scale:
                                                      part.state === "done"
                                                        ? 1
                                                        : 0.9,
                                                  }}
                                                  transition={{
                                                    duration:
                                                      part.state === "done"
                                                        ? 0.3
                                                        : 2,
                                                    repeat:
                                                      part.state === "done"
                                                        ? 0
                                                        : Infinity,
                                                    ease:
                                                      part.state === "done"
                                                        ? "easeOut"
                                                        : "linear",
                                                  }}
                                                  className={cn(
                                                    "size-1.5 rounded-full bg-emerald-500",
                                                    part.state === "done"
                                                      ? "animate-none"
                                                      : "animate-pulse"
                                                  )}
                                                />
                                                <span className="text-sm">
                                                  {part.state === "done"
                                                    ? "Thoughts"
                                                    : "Thinking..."}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-0.5 text-muted-foreground/60">
                                                <ClockFadingIcon className="size-3" />
                                                {part.state === "done" && (
                                                  <div className="text-xs font-mono">
                                                    {calculateReasoningTime(
                                                      message
                                                    ) ||
                                                      `${Math.round(
                                                        part.text.length / 20
                                                      )}s`}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="pointer-events-none px-3.5 py-2.5 bg-input/30 rounded-lg border border-dashed">
                                            <StreamingMarkdown
                                              key={`${message.id}-${i}`}
                                              content={part.text}
                                              onArtifactFound={
                                                handleArtifactFound
                                              }
                                              onArtifactDetected={
                                                handleArtifactDetected
                                              }
                                              onPartialArtifact={
                                                handlePartialArtifact
                                              }
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </motion.div>
                                  );
                                }
                              }
                            })}
                          </AnimatePresence>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* Streaming indicator */}
                  {status === "submitted" && (
                    <motion.div
                      initial={{ opacity: 0.75, filter: "blur(8px)", y: 20 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0.75, filter: "blur(4px)", y: -10 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="px-3 py-1 text-sm"
                    >
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-muted-foreground text-sm"
                      >
                        Thinking...
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            ) : null}

            <div className="z-50 translate-y-56">
              <div
                className={cn(
                  "relative",
                  showArtifactPanel
                    ? "max-w-none mx-auto px-4"
                    : "max-w-2xl mx-auto"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {overflowFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="mb-2 pl-2.5 py-2 border rounded-lg bg-input/30 shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                          {overflowFiles.map((file, index) => (
                            <motion.div
                              key={file.id}
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(4px)",
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              transition={{
                                duration: 0.2,
                                ease: [0.25, 0.1, 0.25, 1],
                                delay: index * 0.05,
                              }}
                              layout
                              className="min-w-0 max-w-36 bg-background border pl-1.5 pr-2 py-1 rounded-lg flex items-center gap-2 group hover:bg-accent/15 transition-all duration-200"
                            >
                              <div className="flex items-center justify-center border p-1 rounded-sm bg-muted/50 shrink-0">
                                <LetterTextIcon className="size-3.5 text-muted-foreground" />
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="text-xs text-muted-foreground font-mono min-w-0 flex-1 cursor-pointer hover:text-foreground transition-colors">
                                    <span className="block truncate">
                                      {file.content.substring(0, 50)}...
                                    </span>
                                    <div className="text-[10px] text-muted-foreground/70">
                                      {file.wordCount} words
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="p-4 w-full !max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="font-medium flex items-center gap-2 pb-2">
                                      Preview of Pasted Content
                                      <div className="flex items-center gap-1.5 border rounded-full px-1.5 py-0.5 shadow-xs">
                                        <span className="text-xs text-muted-foreground/70">
                                          {file.wordCount} words
                                        </span>
                                        <span className="rounded-full bg-foreground/25 w-1 h-1 inline-block" />
                                        <span className="text-xs text-muted-foreground/70">
                                          {file.charCount} chars
                                        </span>
                                      </div>
                                    </DialogTitle>
                                    <DialogDescription className="text-xs h-[75dvh] font-mono overflow-y-auto text-muted-foreground whitespace-pre-wrap">
                                      {file.content}
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <button
                                onClick={() => removeOverflowFile(file.id)}
                                className="shrink-0 p-0.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
                              >
                                <XIcon className="size-3 text-muted-foreground hover:text-red-400 transition-colors" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textareaValue.trim() || overflowFiles.length > 0) {
                      // Combine current text with overflow files
                      let fullText = textareaValue;
                      if (overflowFiles.length > 0) {
                        const overflowContent = overflowFiles
                          .map((file) => file.content)
                          .join("\n\n");
                        fullText =
                          overflowContent + (fullText ? "\n\n" + fullText : "");
                      }

                      sendMessage(
                        {
                          text: fullText,
                        },
                        {
                          body: {
                            selectedModel,
                            enabledTools,
                          },
                        }
                      );
                      setTextareaValue("");
                      setOverflowFiles([]); // Clear overflow files after sending
                    }
                  }}
                  className="absolute -top-56 left-0 right-0"
                >
                  <div className="bg-gradient-to-b to-background via-background from-transparent w-full h-20 absolute -top-10 left-0 right-0" />
                  <motion.div
                    className="relative"
                    whileHover={{
                      scale: 1.001,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileFocus={{
                      scale: 1.002,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                  >
                    <Textarea
                      placeholder={
                        messages.length === 0
                          ? "What can I do for you today?"
                          : `Reply to ${selectedModel}...`
                      }
                      className="w-full resize-none p-3.5 pr-24 pb-12 overflow-y-auto transition-all duration-200 focus:backdrop-blur-sm border-0 bg-background/95 backdrop-blur-sm"
                      style={{
                        minHeight: messages.length === 0 ? "120px" : "112px",
                        maxHeight: "200px",
                      }}
                      ref={textareaRef}
                      value={textareaValue}
                      onChange={(e) => {
                        const { truncatedText } = handleTextOverflow(
                          e.target.value
                        );
                        setTextareaValue(truncatedText);
                      }}
                    />
                    <div className="absolute top-3 right-4 text-muted-foreground border px-1.5 py-0.5 rounded-sm text-xs bg-secondary/75 backdrop-blur-sm pointer-events-none">
                      <kbd>/</kbd> focus
                    </div>
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="flex justify-between">
                      <div className="flex gap-2 pointer-events-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className={cn(
                                "w-8 h-8 text-muted-foreground relative !bg-background backdrop-blur-sm transition-all duration-200",
                                enabledTools.length > 0 &&
                                  "border !border-blue-500/25 !bg-blue-500/25 text-blue-400 hover:text-blue-300 shadow-blue-500/20 shadow-sm"
                              )}
                              variant="outline"
                            >
                              <SlidersHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent asChild align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search tool..."
                                autoFocus={true}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No tools found</CommandEmpty>
                                <CommandGroup heading="Available Tools">
                                  <CommandItem
                                    onSelect={() => {
                                      if (enabledTools.includes("reasoning")) {
                                        setEnabledTools(
                                          enabledTools.filter(
                                            (t) => t !== "reasoning"
                                          )
                                        );
                                      } else {
                                        setEnabledTools([
                                          ...enabledTools,
                                          "reasoning",
                                        ]);
                                      }
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ClockFadingIcon className="size-4" />
                                      Reasoning
                                    </div>
                                    <Switch
                                      checked={enabledTools.includes(
                                        "reasoning"
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setEnabledTools([
                                            ...enabledTools,
                                            "reasoning",
                                          ]);
                                        } else {
                                          setEnabledTools(
                                            enabledTools.filter(
                                              (t) => t !== "reasoning"
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() => {
                                      if (enabledTools.includes("webSearch")) {
                                        setEnabledTools(
                                          enabledTools.filter(
                                            (t) => t !== "webSearch"
                                          )
                                        );
                                      } else {
                                        setEnabledTools([
                                          ...enabledTools,
                                          "webSearch",
                                        ]);
                                      }
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GlobeIcon className="size-4" />
                                      Web Search
                                    </div>
                                    <Switch
                                      checked={enabledTools.includes(
                                        "webSearch"
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setEnabledTools([
                                            ...enabledTools,
                                            "webSearch",
                                          ]);
                                        } else {
                                          setEnabledTools(
                                            enabledTools.filter(
                                              (t) => t !== "webSearch"
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 pointer-events-auto">
                        <DropdownMenu
                          open={showModelDropdown}
                          onOpenChange={setShowModelDropdown}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="group font-normal hover:cursor-pointer !bg-transparent backdrop-blur-sm py-2.5 w-40 px-2 focus-visible:ring-0 hover:!bg-background hover:border-border !h-6 rounded transition-all duration-200 ease-out justify-between"
                            >
                              {selectedModel === "claude-sonnet-4" &&
                                "Claude Sonnet 4"}
                              {selectedModel === "claude-opus-4" &&
                                "Claude Opus 4"}
                              {selectedModel === "claude-opus-4.1" &&
                                "Claude Opus 4.1"}
                              <ChevronLeftIcon
                                className={cn(
                                  "group-hover:rotate-90 transition-transform duration-200 size-4 text-muted-foreground/75",
                                  showModelDropdown && "rotate-90"
                                )}
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent asChild align="end">
                            <Command>
                              <CommandInput
                                placeholder="Search model..."
                                autoFocus={true}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No models found</CommandEmpty>
                                <CommandGroup heading="Anthropic">
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-opus-4.1")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Opus 4.1
                                    {selectedModel === "claude-opus-4.1" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-opus-4")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Opus 4
                                    {selectedModel === "claude-opus-4" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                  <CommandItem
                                    onSelect={() =>
                                      setSelectedModel("claude-sonnet-4")
                                    }
                                    className="cursor-pointer justify-between"
                                  >
                                    Claude Sonnet 4
                                    {selectedModel === "claude-sonnet-4" && (
                                      <CheckIcon className="size-4" />
                                    )}
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          type="submit"
                          size="icon"
                          className="w-8 h-8 backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                          disabled={
                            status !== "streaming" &&
                            status !== "submitted" &&
                            !textareaValue.trim() &&
                            overflowFiles.length === 0
                          }
                          onClick={(e) => {
                            if (
                              status === "streaming" ||
                              status === "submitted"
                            ) {
                              e.preventDefault();
                              stop();
                            }
                          }}
                        >
                          {status === "streaming" || status === "submitted" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              version="1.1"
                              fill="currentColor"
                            >
                              <g
                                id="🔍-System-Icons"
                                stroke="none"
                                strokeWidth="1"
                                fill="currentColor"
                                fillRule="evenodd"
                              >
                                <g
                                  id="ic_fluent_arrow_enter_24_filled"
                                  fill="currentColor"
                                  fillRule="nonzero"
                                >
                                  <path
                                    d="M21,4 C21.5128358,4 21.9355072,4.38604019 21.9932723,4.88337887 L22,5 L22,11.5 C22,13.3685634 20.5357224,14.8951264 18.6920352,14.9948211 L18.5,15 L5.415,15 L8.70710678,18.2928932 C9.06759074,18.6533772 9.09532028,19.2206082 8.79029539,19.6128994 L8.70710678,19.7071068 C8.34662282,20.0675907 7.77939176,20.0953203 7.38710056,19.7902954 L7.29289322,19.7071068 L2.29289322,14.7071068 C2.25749917,14.6717127 2.22531295,14.6343256 2.19633458,14.5953066 L2.12467117,14.4840621 L2.12467117,14.4840621 L2.07122549,14.371336 L2.07122549,14.371336 L2.03584514,14.265993 L2.03584514,14.265993 L2.0110178,14.1484669 L2.0110178,14.1484669 L2.00397748,14.0898018 L2.00397748,14.0898018 L2,14 L2.00278786,13.9247615 L2.00278786,13.9247615 L2.02024007,13.7992742 L2.02024007,13.7992742 L2.04973809,13.6878575 L2.04973809,13.6878575 L2.09367336,13.5767785 L2.09367336,13.5767785 L2.14599545,13.4792912 L2.14599545,13.4792912 L2.20970461,13.3871006 L2.20970461,13.3871006 L2.29289322,13.2928932 L2.29289322,13.2928932 L7.29289322,8.29289322 C7.68341751,7.90236893 8.31658249,7.90236893 8.70710678,8.29289322 C9.06759074,8.65337718 9.09532028,9.22060824 8.79029539,9.61289944 L8.70710678,9.70710678 L5.415,13 L18.5,13 C19.2796961,13 19.9204487,12.4051119 19.9931334,11.64446 L20,11.5 L20,5 C20,4.44771525 20.4477153,4 21,4 Z"
                                    id="🎨-Color"
                                  ></path>
                                </g>
                              </g>
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center text-nowrap">
                    <p>
                      LLMs can make mistakes, take their responses with a grain
                      of salt.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </ResizablePanel>

      {/* Artifact Panel */}
      <AnimatePresence mode="popLayout">
        {showArtifactPanel && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={artifactPanelSize}
              minSize={30}
              maxSize={60}
              onResize={setArtifactPanelSize}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  filter: "blur(8px)",
                  x: 100,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                  x: 50,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="h-full bg-background"
              >
                <div className="absolute top-2 right-2 z-20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowArtifactPanel(false);
                      setChatPanelSize(100); // Reset chat panel to full width
                    }}
                    className="h-7 w-7 p-0 text-muted-foreground"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-y-auto">
                  {currentArtifact && (
                    <ArtifactRenderer artifact={currentArtifact} />
                  )}
                  <div className="relative flex h-screen w-full items-center justify-center bg-background">
                    <div
                      className={cn(
                        "absolute inset-0",
                        "[background-size:50px_50px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_0px,transparent_1px)]"
                      )}
                    />
                    {/* Radial gradient for the container to give a faded look */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
                  </div>
                </div>
              </motion.div>
            </ResizablePanel>
          </>
        )}
      </AnimatePresence>
    </ResizablePanelGroup>
  );
}
