import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const links = await prisma.link.findMany({
      where: { creatorIp: ip },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        destinationUrl: true,
        createdAt: true,
        expiresAt: true,
        scanCount: true,
        revoked: true,
      },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
