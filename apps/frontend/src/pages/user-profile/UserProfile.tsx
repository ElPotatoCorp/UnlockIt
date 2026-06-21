import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./userProfile.module.css";

import { useUsers } from "../../api/hooks/useUsers.hook";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const { selectedUser, fetchUserById, clearSelectedUser } = useUsers();

    useEffect(() => {
        if (userId) fetchUserById(userId);
        return () => clearSelectedUser();
    }, [userId]);

    if (!selectedUser) {
        return <p className={styles.loading}>Chargement…</p>;
    }

    const { username, avatar, bio, createdAt } = selectedUser;

    return (
        <div className={styles.page}>
            <UnlockItHelmet
                title={username}
                description={bio ?? `Profil de ${username}`}
                path={`/users/${userId}`}
                image={avatar ?? undefined}
            />

            <div className={styles.header}>
                <img
                    src={avatar ?? "/media/img/default_profile_picture.png"}
                    alt={username}
                    className={styles.avatar}
                />

                <h1 className={styles.username}>{username}</h1>
                <p className={styles.date}>
                    Membre depuis le{" "}
                    {new Date(createdAt).toLocaleDateString("fr-FR")}
                </p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>Biographie</h2>
                <p className={styles.bio}>
                    {bio ?? "Cet utilisateur n’a pas encore écrit de biographie."}
                </p>
            </div>
        </div>
    );
};

export default UserProfile;