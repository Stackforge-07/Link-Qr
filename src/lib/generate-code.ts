import { nanoid } from "nanoid";

/**
 * Generate a URL-safe short code.
 * 8 characters → ~2.8 trillion combinations (64^8 with nanoid's alphabet).
 */
export function generateCode(length = 8): string {
  return nanoid(length);
}
