import type { FC } from "react";
import cardStyles from "../../../styles/card.module.css";

/**
 * TODO: the wallet feature has no backend support in the new API yet:
 * - UserEntity has no `wallet` balance field (and no transactions/history model).
 * - user.service.ts has no add-funds / withdraw / history endpoints.
 *
 * Once those exist, re-build this against useUser().saveUser({ ... }) for balance
 * changes like the rest of this page, plus a dedicated service for the history list
 * (the old version mocked it with a hardcoded array and a setTimeout — don't bring
 * that back, wire it to a real endpoint).
 */
export const Wallet: FC = () => {
  return (
    <section className={cardStyles.card}>
      <h2 className={cardStyles.cardTitle}>Porte‑monnaie</h2>
      <p className={cardStyles.cardText}>
        Cette fonctionnalité arrive bientôt — la nouvelle API ne gère pas encore de solde de
        porte‑monnaie.
      </p>
    </section>
  );
};
