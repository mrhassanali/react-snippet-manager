import { MAX_PARTNER_LEAD_ATTACHMENTS_ALLOWED } from "@/lib/constants/supabase";
import { countWords } from "@/lib/utils";
import z from "zod";

export const MESSAGE_MIN_WORDS = 50;
export const MESSAGE_MAX_WORDS = 1000;

export const FormSchema = z.object({
  message: z.string().trim().refine((value) => countWords(value) >= MESSAGE_MIN_WORDS,
      `Please provide at least ${MESSAGE_MIN_WORDS} words.`,
    )
    .refine(
      (value) => countWords(value) <= MESSAGE_MAX_WORDS,
      `Please keep your description to at most ${MESSAGE_MAX_WORDS} words.`,
    ),
});
