import { Navigate } from "react-router-dom";
import { useUser } from "../../api/hooks/useUser.hook";
import { NotFound } from "../not-found/NotFound";

export const ProfileRedirect = () => {
    const { user } = useUser();

    if (!user) {
        return <NotFound />;
    }

    return <Navigate to={`/users/${user.id}`} replace />;
};
