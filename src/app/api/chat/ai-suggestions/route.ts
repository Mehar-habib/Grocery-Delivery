import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await req.json();
    const prompt = `you are a professional delivery assistance chatbot.
    
    you will be given:
    - role: either "user" or "delivery_boy"
    last message: the last message sent in the conversation

    your task:
    - if role is "user" -> generate 3 whatsapp-style reply suggestions that a user could send to the delivery_boy
    - if role is "delivery_boy", generate 3 whatsapp-style reply suggestions that a deliveryBoy could send to the user.

    Follow these rules:
    -Replies must match the context of the last message
    - keep replies short, human-like and (max 15 words)
    - use emojis to make your reply more human-like
    - must be helpful, respectful, and relevant to the deliver, status, help or location
    - no numbering, no extra instructions, no extra text
    - just return comma separated reply suggestions

    return only three replies suggestions, comma separated

    role: ${role}
    last message: ${message}
    `;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );
    const data = await response.json();
    const replyText = data.candidates?.[0].content.parts?.[0].text || "";
    const suggestions = replyText
      .split(",")
      .map((suggestion: string) => suggestion.trim());
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
