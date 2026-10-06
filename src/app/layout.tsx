import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureQR — Secure QR Link Generator",
  description:
    "Generate secure QR codes that redirect through a verified link. Protect against quishing with interstitial confirmation, link expiry, and revocation.",
  keywords: ["QR code", "secure", "link shortener", "quishing protection", "phishing prevention"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <nav className="navbar">
            <div className="navbar-inner">
              <Link href="/" className="navbar-brand">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                SecureQR
              </Link>
              <ul className="navbar-nav">
                <li>
                  <Link href="/" className="navbar-link">
                    Generator
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="main-content">{children}</main>

          <footer className="footer">
            SecureQR — Protecting against quishing with verified redirect links.
          </footer>
        </div>
      </body>
    </html>
  );
}
