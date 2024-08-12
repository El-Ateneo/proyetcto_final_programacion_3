import { Outlet } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import useTheme from "../hooks/useTheme";
import NavBar from "../components/NavBar";
import FooterBar from "../components/FooterBar";
import { AuthProvider } from "../contexts/AuthContext";
import "./index.css"  

export default function Layout() {
    const [theme, toggleTheme] = useTheme();

    return (
        <AuthProvider initialState= {{isAuthenticated: false}}>
            
                <ThemeContext.Provider value={{ theme, toggleTheme }}>
                    <NavBar appName={"Task Manager"} />
                    <div className="conteiner">  
                        <Outlet />
                    </div>
                    <FooterBar
                        appName={"Created by Frias Alejandro"}
                        socialNetworks={[
                            { name: "facebook", url: "https://facebook.com" },
                            { name: "github", url: "https://github.com/El-Ateneo" },
                            { name: "instagram", url: "https://instagram.com" },
                        ]}
                    />
                </ThemeContext.Provider>
            
        </AuthProvider>
    );
}
