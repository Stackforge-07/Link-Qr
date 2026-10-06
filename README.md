# SecureQR — Secure QR Link Generator

> **Anti-Quishing QR Code Generator with Indirect Redirection, Interstitial Verification, and Animal Form QRs.**

A modern security-first link tool: paste any destination link in, get a verified QR code out. The QR code does **not** encode the raw destination URL directly — it encodes a short redirect link on your domain (`/r/{code}`). That indirection enables instant link revocation, auto-expiration, scam inspection, and interstitial protection against QR-phishing attacks ("quishing").

---

## 🛡️ Security Features

- **Indirect Redirect**: The QR code encodes `https://[your-domain]/r/{code}` — never the raw destination URL.
- **HTTPS-Only Whitelist**: Rejects plain `http://` and dangerous schemes like `javascript:`, `data:`, `file:`, `blob:`, and `vbscript:`.
- **Parser-Based URL Validation**: Uses the standard `URL` constructor to enforce RFC compliance instead of fragile regexes.
- **Interstitial Confirmation Page (`/r/[code]`)**: Shows the destination domain and warning before redirecting to prevent drive-by scanner attacks.
- **Auto-Expiration**: Default 30-day link expiry (configurable from 1 to 365 days).
- **Creator Revocation**: Revoke any link on-demand from the dashboard. Once killed, printed QR codes can never redirect again.
- **Rate Limiting**: Sliding-window limiter per IP preventing automated redirect link spam.
- **Optional Password Protection**: Prompt for password on the interstitial page before redirecting.

---

## 🐾 Animal Form QR Generator & Sky Blue Theme

- **5 Animal Forms**:
  - 🐱 **Sky Cat**: Pointed ears, whiskers, cute paws, and mascot emblem.
  - 🐼 **Cyber Panda**: Round ears, bamboo paw pads, and panda emblem.
  - 🦊 **Cloud Fox**: Bushy tall ears, side whiskers, and fox emblem.
  - 🐶 **Sky Pup**: Floppy drooping puppy ears, paws, and happy pup emblem.
  - 🐰 **Star Bunny**: Upright tall ears, fluffy paws, and twitchy bunny emblem.
- **High Error Correction (Level H)**: Allows up to 30% area tolerance, ensuring full readability across phone cameras and scanner apps.
- **High-Res Retina Export**: Click **Download Animal QR** to download a 2x Retina PNG.
- **Sky Blue Aesthetics**: Dark midnight sky palette (`#050b14`), electric sky-blue accents (`#38bdf8`), and glassmorphism.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
git clone https://github.com/Stackforge-07/Link-Qr.git
cd Link-Qr
npm install
```

### 3. Setup Database
```bash
cp .env.example .env
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & ORM**: SQLite & Prisma
- **QR Engine**: `qrcode` (Level H error correction)
- **Styling**: Vanilla CSS (Sky Blue Glassmorphism)
- **Typography**: Inter & JetBrains Mono

---

## 📄 License
MIT
