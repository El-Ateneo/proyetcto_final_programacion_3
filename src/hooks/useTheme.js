import { useState } from "react";

function useTheme() {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return [theme, toggleTheme];
}

export default useTheme;
