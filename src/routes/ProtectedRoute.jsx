import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    console.log("entro a protectedrouter")
    const { state } = useAuth();
    const { isAuthenticated } = state;
    console.log("isAuthenticated es: ", isAuthenticated)
    const location = useLocation();

    if (!isAuthenticated) {
        console.log("!isAuthenticated es: ", !isAuthenticated)
        return <Navigate to="/home" state={{ from: location }} />;
    }

    return children;
}
