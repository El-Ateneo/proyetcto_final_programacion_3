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
        localStorage.setItem('redirectTo', location.pathname);
        console.log("Ubicación de origen guardada: ", location.pathname);
        console.log("!isAuthenticated es: ", !isAuthenticated)
        //return <Navigate to="/home" state={{ from: location }} />;
        return <Navigate to="/home" />;
    }

    return children;
}
