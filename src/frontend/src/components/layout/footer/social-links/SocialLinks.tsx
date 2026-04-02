import type { FC } from "react";
import styles from "./socialLinks.module.css";

export const SocialLinks: FC = () => (
  <div className={styles.social}>
    <a href="https://discord.com/login" target="_blank" rel="noopener noreferrer">
      <img src="/images/discord-logo.png" alt="Se connecter à Discord" />
    </a>
    <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
      <img src="/images/twitter-logo.png" alt="Se connecter à Twitter/X" />
    </a>
    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
      <img src="/images/youtube-logo.png" alt="Se connecter à YouTube" />
    </a>
  </div>
);