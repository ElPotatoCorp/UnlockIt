export const NAV_LINKS = [
  { to: "/", label: "Magasin" },
  { to: "/purchases", label: "Achats" },
  { to: "/about", label: "À propos" },
  { to: "/help", label: "Aide" },
] as const;

type ProfileLink = {
  to: string | null;
  label: string;
  comingSoon?: boolean;
  isLogout?: boolean;
};

export const PROFILE_LINKS: readonly ProfileLink[] = [
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Paramètres" },
  { to: "/wishlist", label: "Liste de souhaits" },

  // Coming soon
  { to: null, label: "Thèmes", comingSoon: true },
  { to: null, label: "Langues", comingSoon: true },

  // Logout
  { to: "/logout", label: "Se Déconnecter", isLogout: true },
] as const;
