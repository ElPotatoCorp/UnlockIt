import { useUsersStore } from "../stores/users.store";
import { usersService } from "../services/users.service";

export function useUsers() {
    const { users, selectedUser, setUsers, setSelectedUser, clearSelectedUser } = useUsersStore();

    const fetchUsers = async (page = 1, limit = 20) => {
        const data = await usersService.list(page, limit);
        setUsers(data);
    };

    const fetchUserById = async (id: string) => {
        const data = await usersService.getById(id);
        setSelectedUser(data);
    };

    return {
        users,
        selectedUser,
        fetchUsers,
        fetchUserById,
        clearSelectedUser,
    };
}