import { useAuthStore } from "../stores/auth.store";
import { authService } from "../services/auth.service";

export function useAuth() {
  const { session, isLogged, setSession, clearSession } = useAuthStore();

  const login = async (identifier: string, password: string) => {
    await authService.login(identifier, password);
    await fetchSession();
  };

  const register = async (username: string, email: string, password: string) => {
    await authService.register(username, email, password);
  };

  const fetchSession = async () => {
    try {
      const data = await authService.fetchSession();
      setSession(data);
    } catch {
      try {
        await authService.refresh();
        const data = await authService.fetchSession();
        setSession(data);
      } catch {
        clearSession();
      }
    }
  };

  const logout = async () => {
    await authService.logout();
    clearSession();
  };

  return {
    session,
    isLogged,
    login,
    register,
    logout,
    fetchSession,
  };
}