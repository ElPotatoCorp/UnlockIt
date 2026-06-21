import { type FC, useState } from "react";
import styles from "./editableField.module.css";

interface EditableFieldProps {
  label: string;
  value: string | boolean;
  type?: "text" | "select" | "checkbox" | "date" | "phone";
  options?: string[];
  onSave?: (value: string) => Promise<void> | void;
  editable?: boolean;
}

export const EditableField: FC<EditableFieldProps> = ({
  label,
  value,
  type = "text",
  options,
  onSave,
  editable = true,
}) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!onSave) return;
    setLoading(true);
    await onSave(localValue);
    setLoading(false);
    setEditing(false);
  };

  const renderInput = () => {
    if (type === "select" && options)
      return (
        <select
          className={styles.input}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );

    if (type === "checkbox")
      return (
        <input
          type="checkbox"
          checked={localValue === "true"}
          onChange={(e) => setLocalValue(e.target.checked ? "true" : "false")}
        />
      );

    return (
      <input
        type={type}
        className={styles.input}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    );
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      {!editing ? (
        <div className={styles.valueRow}>
          <span className={styles.value}>{value?.toString() || "—"}</span>

          {editable && (
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              Modifier
            </button>
          )}
        </div>
      ) : (
        <div className={styles.editRow}>
          {renderInput()}

          <button className={styles.saveBtn} onClick={save} disabled={loading}>
            {loading ? "..." : "OK"}
          </button>

          <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};