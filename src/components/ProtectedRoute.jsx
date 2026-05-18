import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!user.id) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;