import { useEffect, useState } from "react";
import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
            };

        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
       isAuthenticated: false,
       token: null,
       
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // para recuperar el token de localStorage al cargar la aplicación
        const token = localStorage.getItem('authToken');
        if (token) { 
            dispatch({ type: ACTIONS.LOGIN, payload: token });
        }
        console.log("AuthProvider: isAuthenticated al cargar: ", state.isAuthenticated);
    }, []);


    const actions = {
        login:(token) => {
            
            localStorage.setItem('authToken', token);// Para almacenar el token en localStorage
            dispatch({ type: ACTIONS.LOGIN, payload: token });
            const redirectTo = localStorage.getItem('redirectTo') || "/tasklist";
            //localStorage.removeItem('redirectTo'); // Limpiar la ubicación de origen
            navigate(redirectTo);        

            //const origin = location.state?.from?.pathname || "/tasklist";
            //navigate(origin);
            console.log("entro a action login")
        },
    
        logout: () => {
            console.log("Logout button clicked");
            localStorage.removeItem('authToken');
            dispatch({ type: ACTIONS.LOGOUT });
            console.log("##State after logout: ", state);
            navigate("/home");
            console.log("entro a action logout y el toquen es: ", state)
        
        },

    };
    useEffect(() => {
        console.log("State updated: ", state);
    }, [state]);

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(type) {
    const context = useContext(AuthContext);
    console.log("context es: ", context)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };
