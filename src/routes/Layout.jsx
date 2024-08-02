import { Outlet } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import useTheme from "../hooks/useTheme";
import NavBar from "../components/NavBar";
import FooterBar from "../components/FooterBar";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
    const [theme, toggleTheme] = useTheme();

    return (
        <AuthProvider initialState= {{isAuthenticated: false}}>
            <div
                className={`hero is-fullheight is-flex is-flex-direction-column`}
            >
                <ThemeContext.Provider value={{ theme, toggleTheme }}>
                    <NavBar appName={"Task Manager"} />
                    <div className={`container`}>  
                        <Outlet />
                    </div>
                    <FooterBar
                        appName={"Created by Frias Alejandro"}
                        socialNetworks={[
                            { name: "facebook", url: "https://facebook.com" },
                            { name: "twitter", url: "https://twitter.com" },
                            { name: "instagram", url: "https://instagram.com" },
                        ]}
                    />
                </ThemeContext.Provider>
            </div>
        </AuthProvider>
    );
}
