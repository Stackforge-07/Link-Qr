import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import InterstitialCard from "@/components/InterstitialCard";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Redirect — ${code} | SecureQR`,
    description: "You are about to be redirected. Please verify the destination before continuing.",
    robots: "noindex, nofollow",
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    notFound();
  }

  const isExpired = new Date() > link.expiresAt;
  const isRevoked = link.revoked;

  // Extract domain for display
  let destinationDomain = "";
  let destinationUrl = "";
  try {
    const parsed = new URL(link.destinationUrl);
    destinationDomain = parsed.hostname;
    destinationUrl = link.destinationUrl;
  } catch {
    destinationDomain = "unknown";
  }

  if (isRevoked) {
    return (
      <div className="interstitial-page">
        <div className="interstitial-container">
          <div className="interstitial-card interstitial-card--error">
            <div className="interstitial-icon interstitial-icon--error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h1 className="interstitial-title">Link Revoked</h1>
            <p className="interstitial-message">
              This link has been revoked by its creator and is no longer active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="interstitial-page">
        <div className="interstitial-container">
          <div className="interstitial-card interstitial-card--error">
            <div className="interstitial-icon interstitial-icon--warning">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 className="interstitial-title">Link Expired</h1>
            <p className="interstitial-message">
              This link expired on{" "}
              <strong>{link.expiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>{" "}
              and is no longer active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interstitial-page">
      <div className="interstitial-container">
        <InterstitialCard
          code={code}
          destinationDomain={destinationDomain}
          destinationUrl={destinationUrl}
          hasPassword={Boolean(link.passwordHash)}
        />
      </div>
    </div>
  );
}
