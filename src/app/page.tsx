import GeneratorForm from "@/components/GeneratorForm";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Anti-quishing protection
        </div>
        <h1>
          Generate <span>Secure QR</span> Links
        </h1>
        <p>
          Paste any HTTPS link and get a QR code that redirects through a verified,
          revocable short link — never exposing the raw destination URL.
        </p>
      </section>

      <GeneratorForm />

      <div className="features">
        <div className="feature-card">
          <div className="feature-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>Indirect Redirect</h3>
          <p>QR encodes a short link on your domain, never the raw destination URL.</p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>Auto-Expiry</h3>
          <p>Links expire after 30 days by default. Configurable up to 365 days.</p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Interstitial Check</h3>
          <p>Scanners see the destination domain before being redirected.</p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a5 5 0 0 1 5 5c0 2.5-2 4.5-5 7-3-2.5-5-4.5-5-7a5 5 0 0 1 5-5z" />
              <circle cx="8" cy="18" r="2" />
              <circle cx="16" cy="18" r="2" />
            </svg>
          </div>
          <h3>Animal Form QRs</h3>
          <p>Style in Sky Cat, Cyber Panda, Cloud Fox, Sky Pup, or Star Bunny shapes.</p>
        </div>
      </div>
    </>
  );
}
