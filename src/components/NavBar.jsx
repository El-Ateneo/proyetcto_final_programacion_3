
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import appLogo from "../assets/img/1.gif";
import NavMenu from "./NavMenu";
import LoginModal from "./Auth/LoginModal";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faUserCircle, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function NavBar({ appName }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { state, login, logout } = useAuth();
    const { isAuthenticated } = state;
    const [isLoginModalActive, setLoginModalActive] = useState(false);

    const backgroundClassName = "has-background-" + theme;
    let textClassName = "has-text-";
    textClassName += theme === "dark" ? "light" : "dark";
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
                        <Link className="navbar-item column" to="/home">
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
                        ...(isAuthenticated ? [{ text: "Tasks", url: "/TaskList" }] : []),
                        { text: "About", url: "/about" },
                        { text: "Contact", url: "#contact" },
                    ]}
                />
                <div className="navbar-end">
                    {!isAuthenticated ? (
                        <button
                            className="button is-primary is-small"
                            onClick={() => setLoginModalActive(true)}
                        >
                            <span className="icon">
                                <FontAwesomeIcon icon={faUserCircle} />
                            </span>
                            <span>Login</span>
                        </button>
                    ) : (
                        <>
                            <button className="button is-bulma-link is-small">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <span>Mi información</span>
                            </button>
                            <button className="button is-danger is-small" onClick={logout}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                </span>
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                    <button
                        className={`button  is-small is-${theme === "light" ? "light" : "dark"}`}
                    >
                        <span></span>
                    </button>
                    <button
                        className={`button is-focused is-outlined is-small is-${theme === "dark" ? "light" : "dark"}`}
                        onClick={toggleTheme}
                    >
                        <span></span>
                        <span className="icon fa-2x fa-solid"> 
                            <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun } />
                        </span>
                        <span></span>
                    </button>
                </div>
            </nav>
            {isLoginModalActive && <LoginModal onClose={() => setLoginModalActive(false)} />}
        </header>
    );
}

export default NavBar;