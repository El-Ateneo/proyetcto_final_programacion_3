
import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";


function Login({ onClose }) {
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

    const {actions} = useAuth();
    
    
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
            console.log("Login exitoso, token recibido:", data.token);
            actions.login(data.token);
            onClose(); // Cierra el modal al iniciar sesión correctamente
        } else if (isError) {
        console.error("Error al iniciar sesión:", data);
        }
    }, [data, isError, triggerFetch, actions, onClose]);
    
    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <h1 className="modal-card-title  is-2 mt-8 has-text-success"></h1>
                    <h1 className="modal-card-title  is-8 mt-9 has-text-success">Iniciar sesión</h1>
                    <button className="delete" aria-label="close" onClick={onClose}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </button>  
                </header>
                <section className="modal-card-body">
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
                        <p className="has-text-centered">
                            <span className="icon">
                                < FontAwesomeIcon icon={faSpinner} />
                            </span>
                            Cargando...
                        </p>
                    )}
                    {isError && (
                        <p className="has-text-centered has-text-danger">Error al cargar los datos.</p>
                    )}
                    {data && (
                        <p className="has-text-centered">{`Token obtenido: ${data.token}`}</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Login;
