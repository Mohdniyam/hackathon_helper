import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react";
export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// src/auth/ProtectRoute.tsx

// // src/auth/ProtectRoute.tsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import type { JSX } from "react";

// interface ProtectedRouteProps {
//   children: JSX.Element;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { user, loading } = useAuth();

//   // While Firebase is still figuring out if the user is logged in
//   if (loading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center text-sm text-muted-foreground">
//         Checking session...
//       </div>
//     );
//   }

//   // After loading is done, if no user -> go to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Logged in -> render the protected layout/page
//   return children;
// }
