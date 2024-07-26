import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

function NavMenu({ items }) {
    const { theme } = useContext(ThemeContext);

    const backgroundClassName = "has-background-" + theme;

    let textClassName = "has-text-";

    if (theme === "dark") {
        textClassName += "light";
    } else {
        textClassName += "dark";
    }

    const className = backgroundClassName + " " + textClassName;

    return (
        <div className="navbar-menu">
            <div className="navbar-start">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        className={"navbar-item " + className}
                        to={item.url}
                    >
                        {item.text}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default NavMenu;
