
import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({
    //state: {},
    //actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    CHECK_AUTH: "CHECK_AUTH",
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
        case ACTIONS.CHECK_AUTH:
            return {
                ...state,
                isAuthenticated: !!state.token,
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

    const actions = {
        login:(token) => {
            dispatch({ type: ACTIONS.LOGIN, payload: token });
            const origin = location.state?.from?.pathname || "/tasklist";
            navigate(origin);
            //navigate("/tasklist"); 
            console.log("entro a action login")
        },
    
        logout: () => {
                dispatch({ type: ACTIONS.LOGOUT });
                navigate("/home");
        
        },
        checkAuth : () => {
                dispatch({ type: ACTIONS.CHECK_AUTH });
            },
        };

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
