import { type UIMessage } from "ai";

import { chatAction } from "../../_components/ChatBot/actions";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: UIMessage[] };
    const messages = body.messages ?? [];
    return (await chatAction({ messages })) as Response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Chat API error:", err);
    return new Response(
      `Internal server error: ${err instanceof Error ? err.message : String(err)}\n${err instanceof Error ? err.stack : ""}`,
      { status: 500 },
    );
  }
}
