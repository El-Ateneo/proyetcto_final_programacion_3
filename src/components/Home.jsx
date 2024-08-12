import React from "react";
import { useAuth } from "../contexts/AuthContext";

function Home() {
    const { state } = useAuth();
    const { isAuthenticated } = state;

    return (
        <div className="container has-text-centered "> ^--^
            <div className="box has-background-light">
                <h1 className="title is-2 has-text-info">¡Bienvenido a Task Manager!</h1>
                <p className="subtitle is-4 has-text-dark mt-4">
                    Organiza y gestiona tus proyectos y tareas de manera efectiva y sencilla.
                </p>
                <p className="mt-4 has-text-dark">
                    Con nuestra aplicación, podrás crear proyectos, asignar tareas, 
                    seguir el progreso y colaborar con tu equipo en un entorno
                    intuitivo y amigable.
                </p>
                {isAuthenticated && (
                    <p className="mt-4 has-text-dark">
                        ¡Estás autenticado! Ahora puedes acceder a todas las funcionalidades
                        para optimizar tu flujo de trabajo.
                    </p>
                )}
                {!isAuthenticated && (
                    <p className="mt-4 has-text-dark">
                        ¡No estás autenticado! Inicia sesión para comenzar a gestionar tus proyectos.
                    </p>
                )}
                
            </div>^--^
        </div>
    );
}

export default Home;
