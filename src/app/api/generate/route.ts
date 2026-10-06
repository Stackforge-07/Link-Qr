import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateDestinationUrl } from "@/lib/validate-url";
import { generateCode } from "@/lib/generate-code";
import { generateQrDataUrl } from "@/lib/qr";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting ---
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const rateCheck = checkRateLimit(ip, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before generating more links.",
          retryAfterMs: rateCheck.retryAfterMs,
        },
        { status: 429 }
      );
    }

    // --- Parse body ---
    const body = await request.json();
    const { url: rawUrl, expiresInDays = 30, password } = body;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "A destination URL is required." },
        { status: 400 }
      );
    }

    // --- Validate URL ---
    const validation = validateDestinationUrl(rawUrl);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // --- Generate unique short code ---
    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      const existing = await prisma.link.findUnique({ where: { code } });
      if (!existing) break;
      attempts++;
    } while (attempts < 5);

    if (attempts >= 5) {
      return NextResponse.json(
        { error: "Failed to generate a unique code. Please try again." },
        { status: 500 }
      );
    }

    // --- Compute expiry ---
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Math.min(Math.max(expiresInDays, 1), 365));

    // --- Create link record ---
    const passwordHash =
      typeof password === "string" && password.trim().length > 0
        ? hashPassword(password)
        : null;

    const link = await prisma.link.create({
      data: {
        code,
        destinationUrl: validation.url!.href,
        expiresAt,
        creatorIp: ip,
        passwordHash,
      },
    });

    // --- Generate QR code ---
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/r/${code}`;
    const qrDataUrl = await generateQrDataUrl(shortUrl);

    return NextResponse.json({
      id: link.id,
      code: link.code,
      shortUrl,
      qrDataUrl,
      destinationUrl: link.destinationUrl,
      expiresAt: link.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating link:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
