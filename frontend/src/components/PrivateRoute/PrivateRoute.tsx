import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAppState } from "../../context/state";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAppState();
  const location = useLocation();

  if (user) {
    return children;
  }

  return <Navigate to={"/login"} state={{ from: location }} replace />;
}
