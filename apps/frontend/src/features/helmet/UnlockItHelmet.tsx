import { Helmet } from "react-helmet-async";

interface UnlockItHelmetProps {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  robots?: string;
  type?: "website" | "article";
}

export function UnlockItHelmet({
  title,
  description = "UnlockIt : achetez vos jeux PC moins cher. Clés Steam, Origin et Uplay livrées instantanément au meilleur prix.",
  path,
  image,
  robots = "index, follow",
  type = "website",
}: UnlockItHelmetProps) {
  const baseUrl = "https://unlock-it.com";
  const fullUrl = baseUrl + path;

  const ogImage = image === null
    ? null
    : `${baseUrl}${image || "/default-og-image.png"}`;

  return (
    <Helmet>
      {/* Title */}
      <title>{`UnlockIt – ${title}`}</title>

      {/* Description */}
      <meta name="description" content={description} />

      {/* Robots */}
      <meta name="robots" content={robots} />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={`UnlockIt – ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />

      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={`UnlockIt – ${title}`} />
      <meta name="twitter:description" content={description} />

      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}