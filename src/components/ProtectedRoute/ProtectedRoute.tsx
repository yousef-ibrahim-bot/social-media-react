import { useContext, type ReactNode } from "react";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import { Navigate } from "react-router-dom";
interface ProtectedRouteProps {
  children: ReactNode;
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { Token } = useContext(CreatedAuthenticationContext)!

  if (!Token) {
    return <Navigate to={"/login"} />;
  }
  return <>{children}</>;
}
