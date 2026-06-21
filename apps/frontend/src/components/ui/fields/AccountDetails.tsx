import { type FC } from "react";
import styles from "./accountDetails.module.css";
import { Card } from "../../../components/common/card/Card";
import { useUser } from "../../../api/hooks/useUser.hook";
import { FieldSection } from "./FieldSection";

export const AccountDetails: FC = () => {
    const { user, profile, billing, saveUser, saveProfile, saveBilling } = useUser();

    if (!user) return null;

    return (
        <Card>
            <h2 className={styles.title}>Détails du compte</h2>
            <p className={styles.subtitle}>
                Retrouvez ici vos informations personnelles et données de votre compte UnlockIt.
            </p>

            <FieldSection
                title="Identité"
                fields={[
                    { label: "Nom", value: profile?.lastName ?? "", onSave: (v) => saveProfile({ lastName: v }) },
                    { label: "Prénom", value: profile?.firstName ?? "", onSave: (v) => saveProfile({ firstName: v }) },
                ]}
            />

            <FieldSection
                title="Contact"
                fields={[
                    { label: "Téléphone", value: user.phoneNumber ?? "", onSave: (v) => saveUser({ phoneNumber: v }) },
                    {
                        label: "Pays",
                        value: profile?.country ?? "",
                        type: "select",
                        options: ["France", "Belgique", "Suisse"],
                        onSave: (v) => saveProfile({ country: v }),
                    },
                    {
                        label: "Newsletter",
                        value: profile?.newsletter ?? false,
                        type: "checkbox",
                        onSave: (v) => saveProfile({ newsletter: v === "true" }),
                    },
                    {
                        label: "Date de naissance",
                        value: profile?.birthdate ?? "",
                        type: "date",
                        onSave: (v) => saveProfile({ birthdate: v }),
                    },
                ]}
            />

            <FieldSection
                title="Adresse de facturation"
                fields={[
                    { label: "Nom", value: billing?.lastName ?? "", onSave: (v) => saveBilling({ lastName: v }) },
                    { label: "Prénom", value: billing?.firstName ?? "", onSave: (v) => saveBilling({ firstName: v }) },
                    { label: "Adresse", value: billing?.addressLine1 ?? "", onSave: (v) => saveBilling({ addressLine1: v }) },
                    { label: "Complément", value: billing?.addressLine2 ?? "", onSave: (v) => saveBilling({ addressLine2: v }) },
                    { label: "Ville", value: billing?.city ?? "", onSave: (v) => saveBilling({ city: v }) },
                    { label: "Code postal", value: billing?.postalCode ?? "", onSave: (v) => saveBilling({ postalCode: v }) },
                    {
                        label: "Pays",
                        value: billing?.country ?? "",
                        type: "select",
                        options: ["France", "Belgique", "Suisse"],
                        onSave: (v) => saveBilling({ country: v }),
                    },
                ]}
            />

            <FieldSection
                title="Informations du compte"
                fields={[
                    {
                        label: "Compte créé le",
                        value: new Intl.DateTimeFormat("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }).format(new Date(user.createdAt)),
                        editable: false,
                    },
                ]}
            />
        </Card>
    );
};