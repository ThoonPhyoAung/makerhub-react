import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleBaseRoute({ allowedRoles = [] }) {
  const user = useSelector((state) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}

export default RoleBaseRoute;
