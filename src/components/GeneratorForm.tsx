"use client";

import { useState, FormEvent } from "react";
import QrDisplay from "./QrDisplay";

interface GeneratedLink {
  id: string;
  code: string;
  shortUrl: string;
  qrDataUrl: string;
  destinationUrl: string;
  expiresAt: string;
}

export default function GeneratorForm() {
  const [url, setUrl] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedLink | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {
        url,
        expiresInDays,
      };
      if (showPasswordInput && password.trim()) {
        payload.password = password.trim();
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      setResult(data);
      setUrl("");
      setPassword("");
      setShowPasswordInput(false);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generator">
      <form className="generator-form" onSubmit={handleSubmit} id="generate-form">
        <div className="input-group">
          <div className="input-wrapper">
            <svg
              className="input-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <input
              type="text"
              className="input"
              placeholder="Paste your HTTPS link here…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              id="url-input"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="options-row">
            <div className="expiry-group">
              <label className="expiry-label" htmlFor="expiry-input">
                Expires in
              </label>
              <div className="expiry-input-wrapper">
                <input
                  type="number"
                  className="input input--sm"
                  value={expiresInDays}
                  onChange={(e) =>
                    setExpiresInDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 30)))
                  }
                  min={1}
                  max={365}
                  id="expiry-input"
                />
                <span className="expiry-suffix">days</span>
              </div>
            </div>

            <button
              type="button"
              className={`btn btn--sm ${showPasswordInput ? "btn--secondary" : "btn--ghost"}`}
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              id="toggle-password-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {showPasswordInput ? "Password Protection (Active)" : "+ Add Password"}
            </button>
          </div>

          {showPasswordInput && (
            <div className="input-wrapper password-field-animate">
              <svg
                className="input-icon"
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
                type="text"
                className="input"
                placeholder="Optional password to protect this link…"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="optional-password-input"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--lg btn--glow"
          disabled={isLoading || !url.trim()}
          id="generate-btn"
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" />
              Generating…
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Generate Secure QR
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="form-error" id="form-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {result && (
        <QrDisplay
          qrDataUrl={result.qrDataUrl}
          shortUrl={result.shortUrl}
          destinationUrl={result.destinationUrl}
          expiresAt={result.expiresAt}
        />
      )}
    </div>
  );
}
