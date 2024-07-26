import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [triggerFetch, setTriggerFetch] = useState(false);

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        "https://sandbox.academiadevelopers.com/api-auth/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }
    );


    const { login } = useAuth("actions");

    function handleSubmit(event) {
        event.preventDefault();
        setTriggerFetch(true);
        doFetch();
    }

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
    }

    useEffect(() => {
        if (data && !isError && triggerFetch) {
            login(data.token);
        }
    }, [data, isError, triggerFetch, login]);

    console.log(data)

    return (
        <section className="hero is-fullheight is-primary is-bold">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="box">
                                <div className="has-text-centered mb-6">
                                    <figure className="image is-96x96 is-inline-block">
                                        <img src="src/assets/img/2.jpg" alt="Login Icon" />
                                    </figure>
                                    
                                    <h1 className="title is-4 mt-2 has-text-success">Iniciar sesión</h1>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label htmlFor="username" className="label">Nombre de usuario</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={username}
                                                onChange={handleChange}
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-user"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="password" className="label">Contraseña</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={handleChange}
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <button type="submit" className="button is-primary is-fullwidth">
                                                Enviar
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                {isLoading && triggerFetch && (
                                    <p className="has-text-centered">Cargando...</p>
                                )}
                                {isError && (
                                    <p className="has-text-centered has-text-danger">Error al cargar los datos.</p>
                                )}
                                {data && (
                                    <p className="has-text-centered">{`Token obtenido: ${data.token}`}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
