export function formatDate(dateString?: string | null, t?: (key: string) => string): string {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString(
        t ? t("lang.code") : "fr-FR",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

export function formatDateRelative(dateString?: string | null, t?: (key: string, opts?: any) => string): string {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);
    const diffM = Math.floor(diffD / 30);
    const diffY = Math.floor(diffD / 365);

    if (!t) {
        if (diffSec < 60) return "il y a quelques secondes";
        if (diffMin < 60) return `il y a ${diffMin} min`;
        if (diffH < 24) return `il y a ${diffH} h`;
        if (diffD < 30) return `il y a ${diffD} jour${diffD > 1 ? "s" : ""}`;
        if (diffM < 12) return `il y a ${diffM} mois`;
        return `il y a ${diffY} an${diffY > 1 ? "s" : ""}`;
    }

    if (diffSec < 60) return t("date.relative.seconds");
    if (diffMin < 60) return t("date.relative.minutes", { count: diffMin });
    if (diffH < 24) return t("date.relative.hours", { count: diffH });
    if (diffD < 30) return t("date.relative.days", { count: diffD });
    if (diffM < 12) return t("date.relative.months", { count: diffM });
    return t("date.relative.years", { count: diffY });
}