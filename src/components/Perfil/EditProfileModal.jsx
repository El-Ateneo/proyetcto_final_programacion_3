import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const EditProfileModal = ({ profile, onClose }) => {
    const { state: authState } = useAuth();
    const [formData, setFormData] = useState({
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        dob: profile.dob || '',
        bio: profile.bio || '',
        state: profile.state || '',
        image: null
    });
    const [error, setError] = useState(null);
    const [userStates, setUserStates] = useState([]);

    useEffect(() => {
        const token = authState.token;

        fetch('https://sandbox.academiadevelopers.com/users/user-states/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Datos obtenidos:', data); // Verifica la estructura de los datos
            if (data.results && Array.isArray(data.results)) {
                setUserStates(data.results); // Usa `data.results` para obtener el array
            } else {
                console.error('Datos recibidos no contienen un array en results:', data);
            }
        })
        .catch(error => console.error('Error fetching states:', error));
    }, [authState.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('dob', formData.dob);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('state', formData.state);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        
        const dataToSend = {
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            dob: formData.dob,
            bio: formData.bio,
            state: formData.state,
        };
        
    
           

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/users/profiles/${profile.user__id}/`, {
                method: 'PATCH',
                body: formDataToSend,
                //body: JSON.stringify(dataToSend),
                headers: {
                    'Authorization': `Token ${authState.token}`,
                    //'Content-Type': 'application/json'
                }
            });
            console.log("datos a enviar para actualizar", dataToSend);
            if (!response.ok) {
                // Manejo de errores
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Error updating profile'}`);
            }
    
            // Si la actualización fue exitosa, cierra el modal
            onClose();
        } catch (error) {
            setError(error.message);
            console.error('Error updating profile:', error);
        }
    };


    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <h2 className="title">Editar Perfil</h2>
                    {error && <p className="has-text-danger">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Nombre de Usuario</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Nombre</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Apellido</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Fecha de Nacimiento</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Biografía</label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Estado</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    >
                                        {userStates.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Imagen de Perfil</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-primary" type="submit">
                                    Guardar
                                </button>
                                <button
                                    className="button"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
            
        </div>
        
    );
};

export default EditProfileModal;
