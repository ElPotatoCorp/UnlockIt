import { type FC } from "react";
import styles from "./accountDetails.module.css";
import cardStyles from "../../../styles/card.module.css";
import { Card } from "../../../components/common/card/Card";
import { useUser } from "../../../api/hooks/useUser.hook";

export const AccountDetails: FC = () => {
  const { user, profile, billing, saveUser, saveProfile, saveBilling } = useUser();

  if (!user) return null;

  // Identité (profile entity)
  const identityFields: FieldItem[] = [
    {
      label: "Nom :",
      value: profile?.lastName ?? "",
      fieldKey: "lastName",
      editable: true,
      onSave: (val: string) => saveProfile({ lastName: val }),
    },
    {
      label: "Prénom :",
      value: profile?.firstName ?? "",
      fieldKey: "firstName",
      editable: true,
      onSave: (val: string) => saveProfile({ firstName: val }),
    },
  ];

  // Contact (phoneNumber lives on the user entity, the rest on the profile entity)
  const contactFields: FieldItem[] = [
    {
      label: "N° Téléphone :",
      value: user.phoneNumber ?? "",
      type: "phone",
      fieldKey: "phoneNumber",
      editable: true,
      onSave: (val: string) => saveUser({ phoneNumber: val }),
    },
    {
      label: "Pays :",
      value: profile?.country ?? "",
      type: "select",
      options: ["France", "Belgique", "Suisse"],
      fieldKey: "country",
      editable: true,
      onSave: (val: string) => saveProfile({ country: val }),
    },
    {
      label: "Newsletter :",
      value: profile?.newsletter ?? false,
      type: "checkbox",
      fieldKey: "newsletter",
      editable: true,
      onSave: (val: string) => saveProfile({ newsletter: val === "true" }),
    },
    {
      label: "Date de naissance :",
      value: profile?.birthdate ?? "",
      type: "date",
      fieldKey: "birthdate",
      editable: true,
      onSave: (val: string) => saveProfile({ birthdate: val }),
    },
  ];

  // Adresse de facturation: this is now its own structured entity (not a single
  // free-text "billing_address" string), with its own name — it can legitimately
  // differ from the profile identity above (billed to a company, someone else, etc).
  const billingFields: FieldItem[] = [
    {
      label: "Nom :",
      value: billing?.lastName ?? "",
      fieldKey: "billingLastName",
      editable: true,
      onSave: (val: string) => saveBilling({ lastName: val }),
    },
    {
      label: "Prénom :",
      value: billing?.firstName ?? "",
      fieldKey: "billingFirstName",
      editable: true,
      onSave: (val: string) => saveBilling({ firstName: val }),
    },
    {
      label: "Adresse :",
      value: billing?.addressLine1 ?? "",
      fieldKey: "addressLine1",
      editable: true,
      onSave: (val: string) => saveBilling({ addressLine1: val }),
    },
    {
      label: "Complément d'adresse :",
      value: billing?.addressLine2 ?? "",
      fieldKey: "addressLine2",
      editable: true,
      onSave: (val: string) => saveBilling({ addressLine2: val }),
    },
    {
      label: "Ville :",
      value: billing?.city ?? "",
      fieldKey: "city",
      editable: true,
      onSave: (val: string) => saveBilling({ city: val }),
    },
    {
      label: "Code postal :",
      value: billing?.postalCode ?? "",
      fieldKey: "postalCode",
      editable: true,
      onSave: (val: string) => saveBilling({ postalCode: val }),
    },
    {
      label: "Pays :",
      value: billing?.country ?? "",
      type: "select",
      options: ["France", "Belgique", "Suisse"],
      fieldKey: "billingCountry",
      editable: true,
      onSave: (val: string) => saveBilling({ country: val }),
    },
  ];

  const accountInfoFields: FieldItem[] = [
    {
      label: "Compte créé le :",
      value: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(user.createdAt)
      ),
      fieldKey: "createdAt",
    },
    // TODO: "Total dépensé" / "jeux achetés" had no real backend support even before
    // (hardcoded to 0). Nothing in user.service.ts exposes order/ticket stats yet.
  ];

  return (
    <Card>
      <h2 className={cardStyles.cardTitle}>Détails du compte</h2>
      <p className={cardStyles.cardText}>
        Retrouvez ici vos informations personnelles et données de votre compte UnlockIt.
      </p>

      <FieldList items={identityFields} direction="row" gap={16} rows={2} align="stretch" />

      <div className={styles.fieldListWrapper}>
        <FieldList items={contactFields} direction="column" gap={12} align="stretch" />
      </div>

      <div className={styles.fieldListWrapper}>
        <h3 className={cardStyles.cardSubtitle}>Adresse de facturation</h3>
        <FieldList items={billingFields} direction="column" gap={12} align="stretch" />
      </div>

      <FieldList items={accountInfoFields} direction="row" rows={1} gap={16} align="stretch" />
    </Card>
  );
};
