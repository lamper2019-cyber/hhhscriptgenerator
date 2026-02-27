import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const { driver, pillar, delivery, count } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server API key not configured." },
        { status: 500 }
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
        { error: "API key issue. Contact the site owner." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
