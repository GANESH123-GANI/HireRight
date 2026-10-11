/**
 * Security validation utilities for user input.
 * Used for signup, login, and form validation.
 */

// --- Email Validation ---

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

// --- Password Validation ---

export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  if (password.length < 12 || password.length > 128) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

// --- String Sanitization ---

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>'"&]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      case "&":
        return "&amp;";
      default:
        return char;
    }
  });
}

/**
 * Escape HTML entities for safe interpolation into HTML templates.
 * Use this whenever user-provided values are inserted into HTML emails or pages.
 */
export function escapeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- Validation Helpers ---

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function containsOnlyAllowedChars(
  input: string,
  allowed: RegExp
): boolean {
  return allowed.test(input);
}