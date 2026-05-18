const VALID_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Valide un nouveau nom de fichier (sans extension).
 * Retourne un message d'erreur ou null si valide.
 */
export function validateFilename(
    value: string,
    currentFilename: string,
    allFilenames: string[]
): string | null {
    const trimmed = value.trim();

    if (!trimmed) return "Le nom ne peut pas être vide.";

    if (!VALID_NAME_REGEX.test(trimmed)) {
        const invalids = [...new Set(trimmed.split("").filter((c) => !/[a-zA-Z0-9_-]/.test(c)))];
        const display = invalids.map((c) => (c === " " ? "espace" : `"${c}"`)).join(", ");
        return `Caractères non autorisés : ${display}. Utilisez a-z, 0-9, - ou _.`;
    }

    if (trimmed.length > 100) return "Nom trop long (100 caractères max).";

    const currentExt = currentFilename.replace(/^.*(\.[^.]+)$/, "$1");
    const newFullName = `${trimmed}${currentExt}`;
    const collision = allFilenames.find(
        (f) => f === newFullName && f !== currentFilename
    );
    if (collision) return `Ce nom est déjà utilisé par "${collision}".`;

    return null;
}
