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
    SET_LOADING: "SET_LOADING",
    SET_PROFILE: "SET_PROFILE",
    
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
                loading: false,
            };
        case ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                profile: null,
                loading: false,
            };
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case ACTIONS.SET_PROFILE:
            return {
                ...state,
                profile: action.payload,
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    
    const navigate = useNavigate();
    //const location = useLocation();

    const [state, dispatch] = useReducer(reducer, {
        isAuthenticated: false,
        //token: null,
        token: localStorage.getItem('authToken') || null,// para recuperar el token de localStorage al cargar la aplicación
        loading: true,
        profile: null, // Añadido perfil en el estado inicial
    });

    useEffect(() => {
        
        //const token = localStorage.getItem('authToken');
        if (state.token) { 
            dispatch({ type: ACTIONS.LOGIN, payload: state.token });    
            fetchProfileData(state.token); // Fetch profile data
        } else {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
        console.log("AuthProvider: isAuthenticated al cargar: ", state.isAuthenticated);
        console.log("Token encontrado:", state.token);
        console.log("Estado después de verificar token:", state);
    }, [state.token]);

    const fetchProfileData = async (token) => {
        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/users/profiles/profile_data/', {
                headers: {
                    'Authorization': `token ${token}`,
                },
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.SET_PROFILE, payload: data });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    //para controlar el tiempo de inactividad
    useEffect(() => {
        let timeout;
        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            if (state.isAuthenticated){
                timeout = setTimeout(() => {
                    alert("Su sesión ha excedido el tiempo límite. Por favor, ingrese de nuevo.");
                    actions.logout();
                    navigate("/home");
                }, 10 * 60 * 1000); // 15 minutos de inactividad
            }
            
        };

        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('keypress', resetTimeout);
        window.addEventListener('click', resetTimeout);

        resetTimeout();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keypress', resetTimeout);
            window.removeEventListener('click', resetTimeout);
        };
    }, [navigate, state.isAuthenticated]);


    const actions = {
        login:(token) => {
            
            localStorage.setItem('authToken', token);// Para almacenar el token en localStorage
            dispatch({ type: ACTIONS.LOGIN, payload: token });
            fetchProfileData(token); // Fetch profile data after login
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
        console.log("State updated: ", state);//debo eliminar
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
