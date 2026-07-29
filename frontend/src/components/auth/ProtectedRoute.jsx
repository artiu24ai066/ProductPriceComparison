import { Navigate } from "react-router-dom";

import useAppSelector from "../../hooks/useAppSelector";

const ProtectedRoute = ({ children }) => {

    const {
        isAuthenticated,
        loading,
    } = useAppSelector((state) => state.auth);

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
