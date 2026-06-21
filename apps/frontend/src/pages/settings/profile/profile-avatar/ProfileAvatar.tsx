import { type FC, type ChangeEvent, useState, useRef, useEffect } from "react";
import styles from "./profileAvatar.module.css";

import defaultProfilePic from "/media/img/default_profile_picture.png";
import { useUser } from "../../../../api/hooks/useUser.hook";
import { useToast } from "../../../../utils/hooks/useToast";

const MAX_SIZE_KB = 1024;
const MIN_DIM = 120;

export const ProfileAvatar: FC = () => {
  const { user, updateAvatar, loadUser } = useUser();
  const toast = useToast();

  const avatarUrl = user?.avatar ?? null;

  const [preview, setPreview] = useState(avatarUrl);
  const [editing, setEditing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ sizeKB: number; width: number; height: number } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editing) setPreview(avatarUrl);
  }, [avatarUrl, editing]);

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Format non supporté. Utilisez .jpg ou .png");
      return;
    }

    const sizeKB = Math.round(file.size / 1024);
    if (sizeKB > MAX_SIZE_KB) {
      toast.error("Image trop lourde (max 1 Mo)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width < MIN_DIM || img.height < MIN_DIM) {
          toast.error("Dimensions trop petites (min 120x120px)");
          return;
        }
        setPreview(result);
        setFileInfo({ sizeKB, width: img.width, height: img.height });
        setUploadedFile(file);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!uploadedFile) return;

    try {
      await updateAvatar(uploadedFile);
      await loadUser();
      toast.success("Avatar mis à jour.");
      setEditing(false);
      setUploadedFile(null);
    } catch {
      toast.error("Impossible de mettre à jour l’avatar.");
    }
  };

  const handleCancel = () => {
    setPreview(avatarUrl);
    setFileInfo(null);
    setUploadedFile(null);
    setEditing(false);
  };

  return (
    <div className={styles.avatarContainer}>
      {editing ? (
        <>
          <div className={styles.valueWrapper}>
            <div className={styles.avatarWrapper}>
              <img src={preview ?? defaultProfilePic} alt="Preview" className={styles.avatarMask} />
            </div>

            <button type="button" onClick={triggerFileSelect} className={styles.editBtn}>
              <img src="/images/import.png" alt="Importer" className={styles.icon} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleUpload}
              hidden
            />
          </div>

          {fileInfo && (
            <p className={styles.fileInfo}>
              {fileInfo.sizeKB} Ko — {fileInfo.width}×{fileInfo.height}px
            </p>
          )}

          <div className={styles.actionsRow}>
            <button onClick={handleSave} className={styles.actionBtn}>
              Sauvegarder
            </button>
            <button onClick={handleCancel} className={styles.actionBtn}>
              Annuler
            </button>
          </div>
        </>
      ) : (
        <div className={styles.valueWrapper}>
          <div className={styles.avatarWrapper}>
            <img src={preview ?? defaultProfilePic} alt="Photo de profil" className={styles.avatar} />
          </div>

          <button type="button" onClick={() => setEditing(true)} className={styles.editBtn}>
            <img src="/images/edit.png" alt="Editer" className={styles.icon} />
          </button>
        </div>
      )}
    </div>
  );
};