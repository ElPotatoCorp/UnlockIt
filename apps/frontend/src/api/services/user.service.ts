import { api } from "../axios.instance";
import type { UserEntity, UserProfileEntity, UserBillingEntity } from "@unlockit/shared";

export const userService = {
  // -------------------------
  // USER
  // -------------------------
  getUser: async (): Promise<UserEntity> => {
    try {
      const res = await api.get("/user");
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 401) throw { message: "Non authentifié." };
      if (s === 404) throw { message: "Utilisateur introuvable." };
      throw { message: "Erreur serveur." };
    }
  },

  updateUser: async (payload: Partial<UserEntity>) => {
    try {
      const res = await api.patch("/user", payload);
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 400) throw { message: "Données invalides." };
      if (s === 401) throw { message: "Non authentifié." };
      throw { message: "Erreur serveur." };
    }
  },

  deleteUser: async () => {
    try {
      await api.delete("/user");
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 401) throw { message: "Non authentifié." };
      throw { message: "Erreur serveur." };
    }
  },

  // -------------------------
  // PROFILE DETAILS
  // -------------------------
  getProfile: async (): Promise<UserProfileEntity> => {
    try {
      const res = await api.get("/user/profile");
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 401) throw { message: "Non authentifié." };
      if (s === 404) throw { message: "Profil non trouvé." };
      throw { message: "Erreur serveur." };
    }
  },

  updateProfile: async (payload: UserProfileEntity) => {
    try {
      const res = await api.patch("/user/profile", payload);
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 400) throw { message: "Données invalides." };
      if (s === 401) throw { message: "Non authentifié." };
      throw { message: "Erreur serveur." };
    }
  },

  // -------------------------
  // BILLING
  // -------------------------
  getBilling: async (): Promise<UserBillingEntity> => {
    try {
      const res = await api.get("/user/billing");
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 401) throw { message: "Non authentifié." };
      if (s === 404) throw { message: "Aucune adresse enregistrée." };
      throw { message: "Erreur serveur." };
    }
  },

  updateBilling: async (payload: UserBillingEntity) => {
    try {
      const res = await api.patch("/user/billing", payload);
      return res.data;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 400) throw { message: "Données invalides." };
      if (s === 401) throw { message: "Non authentifié." };
      throw { message: "Erreur serveur." };
    }
  },

  // -------------------------
  // AVATAR
  // -------------------------
  updateAvatar: async (file: File) => {
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await api.patch("/user/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.avatar;
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 400) throw { message: "Fichier invalide ou trop volumineux." };
      if (s === 401) throw { message: "Non authentifié." };
      if (s === 404) throw { message: "Utilisateur introuvable." };
      throw { message: "Erreur serveur." };
    }
  },

  deleteAvatar: async () => {
    try {
      await api.delete("/user/avatar");
    } catch (err: any) {
      const s = err.response?.status;
      if (s === 401) throw { message: "Non authentifié." };
      if (s === 404) throw { message: "Utilisateur introuvable." };
      throw { message: "Erreur serveur." };
    }
  },
};