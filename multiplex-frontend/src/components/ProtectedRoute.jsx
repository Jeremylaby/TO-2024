import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

const ProtectedRoute = ({ children, reqRoleLvl }) => {
  const { user } = useAuth();
console.log({user, reqRoleLvl})
  if (!user || ((user.role ?? 0) < reqRoleLvl)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  reqRoleLvl: PropTypes.number,
};
