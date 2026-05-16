"use server";

import { type UIMessage, streamText } from "ai";

import { env } from "@/env";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";

// OpenRouter via @ai-sdk/openai with a custom base URL.
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Initialize Supabase
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// ---- AI LOGIC ----

const SYSTEM_PROMPT = (context: string) => `
You are SOLARIS, the official AI assistant for the University of Calgary Solar 
Car Team (also known as Calgary Solar Car or UC Solar).

---

## Who You Are

You are named after the sun — warm, energetic, and genuinely excited about 
renewable energy. You speak like a knowledgeable teammate, not a corporate FAQ 
bot. You are approachable for first-year students asking basic questions and 
technically capable enough to discuss solar cell efficiency, embedded systems, 
or aerodynamics with experienced engineers.

---

## Your Mission

1. **Educate**: Share the team's history, mission, and technical achievements.
2. **Support**: Help prospective members find recruitment info and sponsors understand their impact.
3. **Engage**: Use "we," "our," and "the team" to emphasize that you are part of the crew.

---

## Technical Context (Use this to answer)
${context}

---

## Guidelines

- **Accuracy**: Only answer based on the provided context. If you don't know, say "I'm not sure about that, but you can reach out to our team leads on Discord!"
- **Formatting**: Use markdown for readability (bullet points, bold text). Keep responses concise.
- **Tone**: Professional yet enthusiastic. Avoid being overly formal or sounding like an automated system.
- **Safety**: Do not reveal internal API keys, private member contact info, or sensitive financial data unless explicitly part of the context.
`;

export async function chatAction({ messages }: { messages: UIMessage[] }) {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("No messages provided");
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "user") {
      throw new Error("Last message must be a user message");
    }

    // Extract query
    const query: string =
      ((lastMessage as unknown as Record<string, unknown>).content as
        | string
        | undefined) ??
      (
        lastMessage.parts as { type: string; text?: string }[] | undefined
      )?.find((p) => p.type === "text")?.text ??
      "";

    if (!query.trim() || query.length > 4000 || messages.length > 20) {
      throw new Error("Invalid message payload");
    }

    // 1. Generate Embeddings (using HuggingFace)
    const hfRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
      {
        body: JSON.stringify({
          inputs: [query],
          options: { wait_for_model: true },
        }),
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!hfRes.ok) {
      throw new Error(`HF Error: ${hfRes.statusText}`);
    }

    const hfData = (await hfRes.json()) as number[] | number[][];
    const embedding = Array.isArray(hfData[0]) ? hfData[0] : hfData;

    if (embedding?.length !== 384) {
      throw new Error("Failed to generate a valid 384-dimensional embedding");
    }

    // 2. Search Supabase for context
    const { data: documents, error: searchError } = (await supabase.rpc(
      "match_documents",
      {
        match_count: 5,
        match_threshold: 0.1,
        query_embedding: embedding,
      },
    )) as {
      data: { content: string }[] | null;
      error: { message: string } | null;
    };

    if (searchError) {
      throw new Error(`Supabase Error: ${searchError.message}`);
    }

    const context = (documents as { content: string }[])
      ?.map((doc) => doc.content)
      .join("\n\n");

    // 3. Prepare Model Messages
    const modelMessages = messages
      .filter(
        (m): m is UIMessage & { role: "user" | "assistant" } =>
          m.role === "user" || m.role === "assistant",
      )
      .map((m) => ({
        content:
          ((m as unknown as Record<string, unknown>).content as
            | string
            | undefined) ??
          (m.parts
            ? (m.parts as { type: string; text?: string }[])
                .filter(
                  (p): p is { type: "text"; text: string } =>
                    p.type === "text" && typeof p.text === "string",
                )
                .map((p) => p.text)
                .join("")
            : ""),
        role: m.role,
      }));

    // 4. Stream Response using AI SDK
    const result = streamText({
      messages: modelMessages.slice(-6),
      model: openrouter.chat("openrouter/auto"),
      system: SYSTEM_PROMPT(context),
    });

    // Return the native UI Message Stream Response expected by useChat in this SDK version
    interface UIStreamResult {
      toUIMessageStreamResponse(): Response;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (result as unknown as UIStreamResult).toUIMessageStreamResponse();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Chat Action error:", err);
    throw err;
  }
}
