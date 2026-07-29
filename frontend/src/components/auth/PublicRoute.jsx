import { Navigate } from "react-router-dom";

import useAppSelector from "../../hooks/useAppSelector";

const PublicRoute = ({ children }) => {

    const {
        isAuthenticated,
        loading,
    } = useAppSelector((state) => state.auth);

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
