import type { FC } from "react";
import styles from "./legalNotice.module.css";

export const LegalNotice: FC = () => (
  <p className={styles.legal}>
    2025 UnlockIt. Tous droits réservés. <br />
    Toutes les marques déposées sont la propriété de leurs détenteurs respectifs en France et dans d'autres pays. <br />
    La TVA est incluse dans tous les prix lorsqu'elle est applicable.
    <br />
    <span className={styles.links}>
      Politique de confidentialité | Mentions légales | Remboursements | Cookies
    </span>
  </p>
);