import appLogo from "../assets/img/1.gif";
import NavMenu from "./NavMenu";
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

function NavBar({ appName }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const backgroundClassName = "has-background-" + theme;

    let textClassName = "has-text-";

    if (theme === "dark") {
        textClassName += "light";
    } else {
        textClassName += "dark";
    }

    const className = backgroundClassName + " " + textClassName;

    return (
        <header>
            <nav
                className={"navbar " + className}
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <div className="columns is-vcentered">
                        <Link className="navbar-item column" to="/">
                            <img
                                src={appLogo}
                                alt="App Logo"
                                className="image is-100x100"
                            />
                        </Link>
                        <p className="column">{appName}</p>
                    </div>
                </div>
                <NavMenu
                    items={[
                        { text: "Home", url: "/" },
                        { text: "About", url: "/about" },
                        { text: "Contact", url: "#contact" },
                    ]}
                />
                <button
                    className={`button is-small is-${
                        theme === "dark" ? "light" : "dark"
                    }`}
                    onClick={toggleTheme}
                >
                    Cambiar tema
                </button>
            </nav>
        </header>
    );
}

export default NavBar;
