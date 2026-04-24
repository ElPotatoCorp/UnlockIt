import type { FC } from "react";
import styles from "./footer.module.css";
import { SocialLinks } from "./social-links/SocialLinks";
import { LegalNotice } from "./legal-notice/LegalNotice";
import { Logo } from "../../ui/logo/Logo";

export const Footer: FC = () => {
  const isDarkMode = true;

  return (
    <footer className={styles.pageFooter}>
      <Logo color={isDarkMode ? "white" : "black"} size={140}/>
      <LegalNotice />
      <SocialLinks color={isDarkMode ? "white" : "black"} size={42}/>
    </footer>
  );
};
