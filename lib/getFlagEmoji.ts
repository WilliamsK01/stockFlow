/**
 * Retourne l'emoji « flag » Unicode à partir d’un code ISO 2‑lettres
 * Ex. "CI" → "🇨🇮"
 */
export function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
    )
    .join("");
}
