import { UIMessage } from 'ai';
import { z } from 'zod';

export const messageMetadataSchema = z.object({
  reasoning_start: z.number().optional(),
  reasoning_end: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type UIMessageWithMetadata = UIMessage<MessageMetadata>;