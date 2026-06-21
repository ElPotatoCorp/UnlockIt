import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./reviewAuthor.module.css";

import { useUsers } from "../../../../api/hooks/useUsers.hook";

interface Props {
    userId: string;
}

export const ReviewAuthor = ({ userId }: Props) => {
    const { selectedUser, fetchUserById, clearSelectedUser } = useUsers();

    useEffect(() => {
        fetchUserById(userId);
        return () => clearSelectedUser();
    }, [userId]);

    if (!selectedUser) return <p>Chargement auteur…</p>;

    return (
        <Link to={`/users/${selectedUser.id}`} className={styles.author}>
            <img
                src={selectedUser.avatar ?? "/default-avatar.png"}
                className={styles.avatar}
            />

            <div className={styles.info}>
                <strong className={styles.username}>{selectedUser.username}</strong>
                <span className={styles.date}>
                    Membre depuis le{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>

                {selectedUser.bio && (
                    <p className={styles.bio}>{selectedUser.bio}</p>
                )}
            </div>
        </Link>
    );
};