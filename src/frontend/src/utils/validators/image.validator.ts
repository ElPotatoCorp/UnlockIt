/**
 * Valide une URL d'image.
 * Accepte :
 *   - Les chemins /uploads/... (images internes)
 *   - Les URLs http/https avec extension image connue
 *   - Une chaîne vide (non rempli = pas d'erreur, champ optionnel)
 */
export function validateImageUrl(url: string): string | null {
    if (!url || url.trim() === "") return null;

    const trimmed = url.trim();

    // Chemin interne /uploads/
    if (trimmed.startsWith("/uploads/")) {
        const imageExt = /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i;
        if (!imageExt.test(trimmed)) return "Chemin interne invalide (doit finir par .jpg, .png, .webp…)";
        return null;
    }

    // URL externe http/https
    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return "L'URL doit commencer par http:// ou https://";
        }
        const imageExt = /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i;
        if (!imageExt.test(parsed.pathname)) {
            return "L'URL doit pointer vers une image (.jpg, .png, .webp…)";
        }
        return null;
    } catch {
        return "URL invalide — utilisez /uploads/nom.jpg ou une URL https://…";
    }
}
