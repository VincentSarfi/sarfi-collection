/**
 * HTML-escape helper for safely interpolating user-controlled values
 * into HTML email templates. Prevents HTML/link injection (phishing,
 * layout breakage) in emails sent to the host and to guests.
 */
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(input: unknown): string {
  return String(input ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}
