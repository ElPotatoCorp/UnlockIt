import { Helmet } from "react-helmet-async";

interface UnlockItHelmetProps {
  title: string;
  description: string;
  path: string; // ex: "/shop"
  image?: string; // image OG/Twitter optionnelle
}

export function UnlockItHelmet({
  title,
  description,
  path,
  image = "/default-og.png",
}: UnlockItHelmetProps) {
  const baseUrl = "https://unlock-it.com";
  const fullUrl = baseUrl + path;

  return (
    <Helmet>
      {/* Title */}
      <title>{`UnlockIt – ${title}`}</title>

      {/* Description */}
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={`UnlockIt – ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`UnlockIt – ${title}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
    </Helmet>
  );
}