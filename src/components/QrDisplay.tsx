"use client";

import { useState } from "react";
import AnimalQrCanvas from "./AnimalQrCanvas";

interface QrDisplayProps {
  qrDataUrl: string;
  shortUrl: string;
  destinationUrl: string;
  expiresAt: string;
}

export default function QrDisplay({
  qrDataUrl,
  shortUrl,
  destinationUrl,
  expiresAt,
}: QrDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [animalDataUrl, setAnimalDataUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"animal" | "classic">("animal");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    const downloadUrl = viewMode === "animal" && animalDataUrl ? animalDataUrl : qrDataUrl;
    a.href = downloadUrl;
    const prefix = viewMode === "animal" ? "animal-qr" : "secureqr";
    a.download = `${prefix}-${shortUrl.split("/").pop()}.png`;
    a.click();
  };

  const expiresDate = new Date(expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="qr-display" id="qr-result">
      <div className="qr-display-header">
        <div className="qr-success-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Secure QR link generated
        </div>

        {/* Mode switch: Animal Form vs Classic */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "animal" ? "view-mode-btn--active" : ""}`}
            onClick={() => setViewMode("animal")}
            id="view-mode-animal-btn"
          >
            🐾 Animal Form
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "classic" ? "view-mode-btn--active" : ""}`}
            onClick={() => setViewMode("classic")}
            id="view-mode-classic-btn"
          >
            Standard QR
          </button>
        </div>
      </div>

      {viewMode === "animal" ? (
        <AnimalQrCanvas
          text={shortUrl}
          onDataUrlChange={setAnimalDataUrl}
        />
      ) : (
        <div className="qr-image-container">
          <img
            src={qrDataUrl}
            alt="Classic QR Code"
            className="qr-image"
            id="qr-code-image"
          />
          <div className="qr-image-glow" />
        </div>
      )}

      <div className="qr-info">
        <div className="qr-info-row">
          <label className="qr-info-label">Short Link</label>
          <div className="qr-info-value qr-short-url">
            <code>{shortUrl}</code>
            <button
              className="btn btn--icon"
              onClick={handleCopy}
              title="Copy link"
              id="copy-link-btn"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="qr-info-row">
          <label className="qr-info-label">Destination</label>
          <div className="qr-info-value qr-destination">
            <span className="qr-destination-text" title={destinationUrl}>
              {destinationUrl.length > 55
                ? destinationUrl.substring(0, 55) + "…"
                : destinationUrl}
            </span>
          </div>
        </div>

        <div className="qr-info-row">
          <label className="qr-info-label">Expires</label>
          <div className="qr-info-value">{expiresDate}</div>
        </div>
      </div>

      <div className="qr-actions">
        <button
          className="btn btn--primary btn--glow"
          onClick={handleDownload}
          id="download-qr-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {viewMode === "animal" ? "Download Animal QR" : "Download Standard QR"}
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleCopy}
          id="copy-link-btn-alt"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy Short Link"}
        </button>
      </div>
    </div>
  );
}
