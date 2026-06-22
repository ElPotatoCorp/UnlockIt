import { type FC, useState } from "react";
import styles from "./profile.module.css";
import { useUser } from "../../../api/hooks/useUser.hook";
import { Card } from "../../../components/common/card/Card";
import { ProfileAvatar } from "./profile-avatar/ProfileAvatar";
import { useToast } from "../../../utils/hooks/useToast";
import { Button } from "../../../components/common/button/Button";

export const Profile: FC = () => {
  const { user, saveUser } = useUser();
  const toast = useToast();

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const handleSave = async () => {
    if (username === user.username && bio === (user.bio ?? "")) {
      toast.info("Aucun changement détecté.");
      return;
    }

    setLoading(true);
    try {
      await saveUser({ username, bio });
      toast.success("Votre profil a été mis à jour.");
    } catch {
      toast.error("Impossible de sauvegarder votre profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className={styles.title}>Profil</h2>
      <p className={styles.subtitle}>
        Cette section est publique : elle est visible par les autres utilisateurs d’UnlockIt.
      </p>

      <div className={styles.profile}>
        <ProfileAvatar />

        <div className={styles.fieldGroup}>
          <label>Pseudo</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Bio</label>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Sauvegarde..." : "Enregistrer"}
        </Button>

        <ul className={styles.infoList}>
          <li>Compte créé le {formatDate(user.createdAt)}</li>
        </ul>
      </div>
    </Card>
  );
};