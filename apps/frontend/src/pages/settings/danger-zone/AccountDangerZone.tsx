import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./accountDangerZone.module.css";
import { useUser } from "../../../api/hooks/useUser.hook";
import { useToast } from "../../../utils/hooks/useToast";

export const AccountDangerZone: FC = () => {
  const navigate = useNavigate();
  const { deleteUser } = useUser();
  const toast = useToast();

  const [expanded, setExpanded] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [hasRead, setHasRead] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setConfirmation("");
    setHasRead(false);
  };

  const toggle = () => {
    if (expanded) resetState();
    setExpanded(!expanded);
  };

  const isConfirmed = confirmation === "SUPPRIMER" && hasRead;

  const handleDelete = async () => {
    if (!isConfirmed || loading) return;

    setLoading(true);

    try {
      await deleteUser(); // logout() est déjà appelé dans le hook
      toast.success("Votre compte a été supprimé.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message ?? "Une erreur est survenue lors de la suppression du compte.");
      setLoading(false);
    }
  };

  return (
    <section className={`${styles.section} ${styles.dangerCard}`}>
      <h2 className={styles.title}>Zone sensible</h2>

      <div className={styles.optionRow}>
        <span>Suppression du compte</span>
        <button className={styles.toggleBtn} onClick={toggle}>
          {expanded ? "Annuler" : "Démarrer la suppression"}
        </button>
      </div>

      {expanded && (
        <>
          <p className={styles.warning}>
            Attention : la suppression de votre compte est définitive et entraîne les conséquences suivantes :
          </p>

          <ul className={styles.consequences}>
            <li>
              <span>Clés non utilisées</span> — inaccessibles. Pensez à les utiliser, les offrir ou les conserver.
            </li>
            <li>
              <span>Historique d’achats et téléchargements</span> — effacé définitivement.
            </li>
            <li>
              <span>Notifications et assistance</span> — vous ne recevrez plus aucun suivi.
            </li>
          </ul>

          <div className={styles.confirmRow}>
            <p className={styles.warning}>
              Tapez <strong>SUPPRIMER</strong> pour confirmer.
            </p>

            <input
              type="text"
              placeholder="Confirmez la suppression"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className={styles.confirmInput}
            />
          </div>

          <div className={styles.actionRow}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="hasRead"
                checked={hasRead}
                onChange={(e) => setHasRead(e.target.checked)}
              />
              <label htmlFor="hasRead">J’ai lu les conséquences ci‑dessus</label>
            </div>

            <button
              className={`${styles.deleteBtn} ${isConfirmed ? styles.active : ""}`}
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
            >
              {loading ? "Suppression en cours..." : "Supprimer"}
            </button>
          </div>
        </>
      )}
    </section>
  );
};