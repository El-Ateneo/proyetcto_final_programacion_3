import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
    const { state } = useAuth();
    const { isAuthenticated } = state;


    return (
        
        <div>
            
            <h1>Welcome to Task Manager</h1>
            <p>
                Manage your tasks effectively and efficiently with our application.
            </p>

            <figure className="image is-400x396 is-inline-block">
                 <img src="src/assets/img/checklist.gif" alt="Login Icon" />
            </figure>

           
        </div>
    )
}

export default Home;
