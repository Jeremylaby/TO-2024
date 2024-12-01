import { useAuth} from "./AuthProvider.jsx";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles:  PropTypes.arrayOf(PropTypes.number).isRequired,
};