/**
 * URL validation for the Secure QR Link Generator.
 *
 * Rules:
 * - Must be a valid URL (parsed with the URL constructor, not regex)
 * - Must use the https: scheme (http:, javascript:, data:, file:, etc. are rejected)
 * - Must have a non-empty hostname
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  url?: URL;
}

const BLOCKED_SCHEMES = new Set([
  "javascript:",
  "data:",
  "file:",
  "vbscript:",
  "blob:",
  "ftp:",
  "http:",
]);

export function validateDestinationUrl(raw: string): ValidationResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { valid: false, error: "URL is required." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }

  // Explicit block list check (covers http: and dangerous schemes)
  if (BLOCKED_SCHEMES.has(parsed.protocol)) {
    if (parsed.protocol === "http:") {
      return {
        valid: false,
        error: "Only HTTPS URLs are accepted. Please use https:// instead of http://.",
      };
    }
    return {
      valid: false,
      error: `The "${parsed.protocol}" scheme is not allowed for security reasons.`,
    };
  }

  // Only https: is allowed
  if (parsed.protocol !== "https:") {
    return {
      valid: false,
      error: `Only HTTPS URLs are accepted. Got "${parsed.protocol}".`,
    };
  }

  // Must have a real hostname
  if (!parsed.hostname || parsed.hostname.length === 0) {
    return { valid: false, error: "URL must have a valid hostname." };
  }

  // Reject IP-based hosts that look suspicious (optional hardening)
  // We allow them for now but could add a blocklist here

  return { valid: true, url: parsed };
}
