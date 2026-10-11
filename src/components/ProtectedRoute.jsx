import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ redirectTo = "/login" }) {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const location = useLocation();

  if (!isLogin) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
