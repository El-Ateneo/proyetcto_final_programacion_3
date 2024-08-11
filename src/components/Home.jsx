import React from "react";
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

            <figure className="image is-616x417 is-inline-block is-background">
                 <img src="https://i.pinimg.com/736x/c5/ec/53/c5ec534eb0f409d9bd30b8d2b44c966a.jpg" />
            </figure>

           
        </div>
    )
}

export default Home;
