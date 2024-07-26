import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";


function FooterBar({ socialNetworks, appName }) {
    const { theme } = useContext(ThemeContext);

    return (
        <footer
            className={`footer ${
                theme === "light"
                    ? "has-background-light"
                    : "has-background-dark"
            }`}
        >
            <div className="content has-text-centered">
                {socialNetworks.map((socialNetwork) => (
                    <a
                        key={socialNetwork.name}
                        className="icon"
                        href={socialNetwork.url}
                    >
                        <i
                            className={`fab fa-${socialNetwork.name} ${
                                theme === "light"
                                    ? "has-text-dark"
                                    : "has-text--bulma-link-h"
                            }`}
                        ></i>
                    </a>
                ))}
                <p
                    className={`${
                        theme === "light" ? "has-text-dark" : "has-text--bulma-link-h"
                    }`}
                >
                    &copy; {new Date().getFullYear()} {appName}. Todos los
                    derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default FooterBar;
