import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "A link ID is required." },
        { status: 400 }
      );
    }

    const link = await prisma.link.findUnique({ where: { id } });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found." },
        { status: 404 }
      );
    }

    if (link.revoked) {
      return NextResponse.json(
        { error: "Link is already revoked." },
        { status: 400 }
      );
    }

    await prisma.link.update({
      where: { id },
      data: { revoked: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking link:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
