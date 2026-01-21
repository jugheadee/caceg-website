// utils/formatPhone.ts (or just paste it in the components for now)
export function formatPhone(phone: string): string {
  // Remove everything except digits and +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Ensure it starts with +213
  if (!cleaned.startsWith("+213")) {
    cleaned = "+213" + cleaned.replace(/^\+?213?/, "");
  }

  // Extract digits after +213
  const digits = cleaned.replace("+213", "");

  // Take first 9 digits (Algerian mobile format)
  const mainDigits = digits.slice(0, 9).padEnd(9, "0");

  // Format: 3 + space + 2 + space + 2
  const formatted = mainDigits.replace(/(\d{3})(\d{2})(\d{2})/, "$1 $2 $3");

  return `+213 ${formatted}`;
}
