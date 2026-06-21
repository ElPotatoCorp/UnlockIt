import { type FC } from "react";
import { EditableField } from "./EditableField";
import styles from "./fieldSection.module.css";

interface FieldItem {
  label: string;
  value: any;
  type?: "text" | "select" | "checkbox" | "date" | "phone";
  options?: string[];
  editable?: boolean;
  onSave?: (value: string) => Promise<void> | void;
}

interface FieldSectionProps {
  title?: string;
  fields: FieldItem[];
}

export const FieldSection: FC<FieldSectionProps> = ({ title, fields }) => {
  return (
    <div className={styles.section}>
      {title && <h3 className={styles.title}>{title}</h3>}

      {fields.map((f) => (
        <EditableField key={f.label} {...f} />
      ))}
    </div>
  );
};