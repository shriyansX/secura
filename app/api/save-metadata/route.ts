import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, passwords, cards } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    // For now, we'll just return success since the main storage is in localStorage
    // The Clerk metadata update can be implemented later if needed
    console.log("Metadata save request:", { userId, hasPasswords: !!passwords, hasCards: !!cards });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("save-metadata error", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
