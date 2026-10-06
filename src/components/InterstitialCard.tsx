"use client";

import { useState, FormEvent } from "react";

interface InterstitialCardProps {
  code: string;
  destinationDomain: string;
  destinationUrl: string;
  hasPassword?: boolean;
}

export default function InterstitialCard({
  code,
  destinationDomain,
  destinationUrl,
  hasPassword = false,
}: InterstitialCardProps) {
  const [password, setPassword] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (hasPassword && !password.trim()) {
      setError("Please enter the password for this link.");
      return;
    }

    setIsRedirecting(true);
    setError(null);

    try {
      const res = await fetch("/api/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          ...(hasPassword ? { password } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setIsRedirecting(false);
        return;
      }

      // Redirect to the destination
      window.location.href = data.destinationUrl;
    } catch {
      setError("Failed to process redirect. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="interstitial-card">
      <div className="interstitial-icon interstitial-icon--info">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 12 15 16 10" className="shield-check" />
        </svg>
      </div>

      <h1 className="interstitial-title">You&apos;re about to leave SecureQR</h1>

      <p className="interstitial-message">
        This link will take you to:
      </p>

      <div className="interstitial-destination">
        <span className="interstitial-destination-domain">{destinationDomain}</span>
        <span className="interstitial-destination-url">{destinationUrl}</span>
      </div>

      {hasPassword && (
        <form onSubmit={handleContinue} className="password-gate-form">
          <div className="password-input-wrapper">
            <svg
              className="password-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              className="input"
              placeholder="Enter password to access link…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              id="link-password-input"
            />
          </div>
        </form>
      )}

      <p className="interstitial-warning">
        Please verify this is a site you trust before continuing.
      </p>

      {error && (
        <div className="interstitial-error" id="interstitial-error">
          {error}
        </div>
      )}

      <div className="interstitial-actions">
        <button
          className="btn btn--primary btn--lg"
          onClick={() => handleContinue()}
          disabled={isRedirecting}
          id="continue-redirect-btn"
        >
          {isRedirecting ? (
            <>
              <span className="btn-spinner" />
              Redirecting…
            </>
          ) : (
            "Continue to Site →"
          )}
        </button>

        <button
          className="btn btn--ghost"
          onClick={() => window.history.back()}
          disabled={isRedirecting}
          id="cancel-redirect-btn"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
