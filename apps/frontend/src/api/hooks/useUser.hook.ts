import { userService } from "../services/user.service";
import { useUserStore } from "../stores/user.store";
import { useAuth } from "./useAuth.hook";

export function useUser() {
    const {
        user,
        profile,
        billing,
        setUser,
        clearUser,
        setProfile,
        clearProfile,
        setBilling,
        clearBilling,
    } = useUserStore();

    const { fetchSession, logout } = useAuth();

    // -------------------------
    // USER
    // -------------------------
    const loadUser = async () => {
        try {
            const data = await userService.getUser();
            setUser(data);
        } catch (err: any) {
            if (err.message === "Non authentifié.") {
                try {
                    await fetchSession();
                    const data = await userService.getUser();
                    setUser(data);
                } catch {
                    logout();
                }
            }
        }
    };

    const saveUser = async (payload: any) => {
        try {
            const data = await userService.updateUser(payload);
            setUser(data);
        } catch (err) {
            throw err;
        }
    };

    const deleteUser = async () => {
        try {
            await userService.deleteUser();
            clearUser();
            clearProfile();
            clearBilling();
            logout();
        } catch (err) {
            throw err;
        }
    };

    // -------------------------
    // PROFILE DETAILS
    // -------------------------
    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err: any) {
            if (err.message === "Non authentifié.") {
                try {
                    await fetchSession();
                    const data = await userService.getProfile();
                    setProfile(data);
                } catch {
                    logout();
                }
            }
        }
    };

    const saveProfile = async (payload: any) => {
        try {
            const data = await userService.updateProfile(payload);
            setProfile(data);
        } catch (err) {
            throw err;
        }
    };

    // -------------------------
    // BILLING
    // -------------------------
    const loadBilling = async () => {
        try {
            const data = await userService.getBilling();
            setBilling(data);
        } catch (err: any) {
            if (err.message === "Non authentifié.") {
                try {
                    await fetchSession();
                    const data = await userService.getBilling();
                    setBilling(data);
                } catch {
                    logout();
                }
            }
        }
    };

    const saveBilling = async (payload: any) => {
        try {
            const data = await userService.updateBilling(payload);
            setBilling(data);
        } catch (err) {
            throw err;
        }
    };

    // -------------------------
    // AVATAR
    // -------------------------
    const updateAvatar = async (file: File) => {
        try {
            return await userService.updateAvatar(file);
        } catch (err) {
            throw err;
        }
    };

    const removeAvatar = async () => {
        try {
            await userService.deleteAvatar();
        } catch (err) {
            throw err;
        }
    };

    return {
        user,
        profile,
        billing,

        loadUser,
        saveUser,
        deleteUser,

        loadProfile,
        saveProfile,

        loadBilling,
        saveBilling,

        updateAvatar,
        removeAvatar,
    };
}