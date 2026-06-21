import { type FC, useEffect, useState } from "react";
import styles from "./wallet.module.css";
import { Card } from "../../../components/common/card/Card";
import { useToast } from "../../../utils/hooks/useToast";
import { useWallet } from "../../../api/hooks/useWallet.hook";

export const Wallet: FC = () => {
  const toast = useToast();
  const { balance, transactions, loadBalance, loadTransactions, topUp } = useWallet();

  const [debugAmount, setDebugAmount] = useState(10);

  useEffect(() => {
    loadBalance();
    loadTransactions(1, 5); // On charge seulement les 5 dernières transactions
  }, []);

  const handleTopUp = async () => {
    try {
      await topUp(debugAmount);
      toast.success(`+${debugAmount}€ ajoutés au wallet`);
      loadTransactions(1, 5);
    } catch (err: any) {
      toast.error(err.message ?? "Impossible d'ajouter de l'argent");
    }
  };

  return (
    <Card>
      <h2 className={styles.title}>Wallet</h2>
      <p className={styles.subtitle}>Gérez votre solde UnlockIt et consultez vos dernières opérations.</p>

      {/* Solde */}
      <div className={styles.balanceBox}>
        <span className={styles.balanceLabel}>Solde actuel :</span>
        <span className={styles.balanceValue}>
          {!balance ? "Chargement..." : `${balance.balance.toFixed(2)} €`}
        </span>
      </div>

      {/* Dernières transactions */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Dernières transactions</h3>

        {!transactions || transactions.data.length === 0 ? (
          <p className={styles.empty}>Aucune transaction récente.</p>
        ) : (
          <ul className={styles.txList}>
            {transactions.data.map((tx) => (
              <li key={tx.id} className={styles.txItem}>
                <div className={styles.txLeft}>
                  <span className={styles.txType}>
                    {tx.type === "purchase" ? "Achat" : "Crédit"}
                  </span>
                  <span className={styles.txDate}>
                    {new Date(tx.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <span
                  className={`${styles.txAmount} ${tx.amount < 0 ? styles.negative : styles.positive
                    }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}€` : `${tx.amount}€`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debug top-up */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Debug : Ajouter de l’argent</h3>

        <div className={styles.debugRow}>
          <input
            type="number"
            min={1}
            className={styles.debugInput}
            value={debugAmount}
            onChange={(e) => setDebugAmount(Number(e.target.value))}
          />

          <button className={styles.debugBtn} onClick={handleTopUp}>
            Ajouter
          </button>
        </div>

        <p className={styles.debugWarning}>
          ⚠️ Fonction de développement — sera désactivée en production.
        </p>
      </div>
    </Card>
  );
};