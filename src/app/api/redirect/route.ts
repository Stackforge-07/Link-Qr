import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, password } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "A link code is required." },
        { status: 400 }
      );
    }

    const link = await prisma.link.findUnique({ where: { code } });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found." },
        { status: 404 }
      );
    }

    if (link.revoked) {
      return NextResponse.json(
        { error: "This link has been revoked." },
        { status: 410 }
      );
    }

    if (new Date() > link.expiresAt) {
      return NextResponse.json(
        { error: "This link has expired." },
        { status: 410 }
      );
    }

    // Password verification if protected
    if (link.passwordHash) {
      if (!password || typeof password !== "string") {
        return NextResponse.json(
          { error: "Password is required to access this link.", requiresPassword: true },
          { status: 401 }
        );
      }
      if (!verifyPassword(password, link.passwordHash)) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again.", requiresPassword: true },
          { status: 401 }
        );
      }
    }

    // Increment scan count
    await prisma.link.update({
      where: { code },
      data: { scanCount: { increment: 1 } },
    });

    return NextResponse.json({
      destinationUrl: link.destinationUrl,
    });
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
