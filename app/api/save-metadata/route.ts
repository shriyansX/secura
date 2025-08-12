import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId, passwords, cards } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    // Get existing metadata to preserve other fields
    const user = await clerkClient.users.getUser(userId);
    const existingMetadata = user.privateMetadata as Record<string, any> || {};

    // Update only the secura fields
    const updatedMetadata = {
      ...existingMetadata,
      ...(passwords !== undefined && { secura_passwords: passwords }),
      ...(cards !== undefined && { secura_cards: cards }),
    };

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: updatedMetadata,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("save-metadata error", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
