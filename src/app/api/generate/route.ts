import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const { driver, pillar, delivery, count, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required. Add your Anthropic API key in settings." },
        { status: 400 }
      );
    }

    if (!driver) {
      return NextResponse.json(
        { error: "Driver is required." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const seed = Math.floor(Math.random() * 1000000);
    const userPrompt = buildUserPrompt(driver, pillar, delivery, count, seed);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const text = textBlock ? textBlock.text : "";

    return NextResponse.json({ scripts: text });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Check your Anthropic API key in settings." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
