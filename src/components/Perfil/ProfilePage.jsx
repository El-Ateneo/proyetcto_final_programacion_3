import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import EditProfileModal from './EditProfileModal';

function ProfilePage() {
    const { state } = useAuth();
    const { isAuthenticated, token } = state;
    const [profile, setProfile] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchProfileData();
        }
    }, [isAuthenticated, token]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/users/profiles/profile_data/', {
                headers: {
                    'Authorization': `token ${token}`,
                },
            });
            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const handleEditClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        setModalOpen(false);
    };

    if (!profile) return <div className="has-text-centered">Loading...</div>;

    const profileImageUrl = `https://sandbox.academiadevelopers.com${profile.image}`;

    return (
        <div className="container mt-5">
            <h1 className="title is-2 has-text-centered has-text-primary">Mi Perfil</h1>
            <div className="columns is-centered">
                <div className="column is-8-tablet is-6-desktop is-5-widescreen">
                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <figure className="image is-128x128 has-border">
                                <img className="is-rounded" src={profileImageUrl} alt="User Profile" />
                            </figure>
                        </div>
                        <div className="column">
                            <div className="box has-background">
                                <div className="content">
                                    <p className="title is-4">Datos del usuario:</p>
                                    <p className="subtitle is-5">Nombre de Usuario: <strong>{profile.username}</strong></p>
                                    <p className="subtitle is-5">Nombre: <strong>{profile.first_name}</strong></p>
                                    <p className="subtitle is-5">Apellido: <strong>{profile.last_name}</strong></p>
                                    <p className="subtitle is-5">Email: <strong>{profile.email}</strong></p>
                                    <p className="subtitle is-5">Fecha de Nacimiento: <strong>{profile.dob ? profile.dob : 'No proporcionada'}</strong></p>
                                    <p className="subtitle is-5">Biografía: <strong>{profile.bio ? profile.bio : 'No proporcionada'}</strong></p>
                                    <p className="subtitle is-5">Estado: <strong>{profile.state ? profile.state.name : 'No proporcionado'}</strong></p>
                                    <p className="subtitle is-5">Creado el: <strong>{new Date(profile.created_at).toLocaleString()}</strong></p>
                                    <p className="subtitle is-5">Actualizado el: <strong>{new Date(profile.updated_at).toLocaleString()}</strong></p>
                                    <button className="button is-primary is-fullwidth mt-4" onClick={handleEditClick}>
                                        Editar Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <EditProfileModal
                    profile={profile}
                    onClose={handleCloseModal}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
}

export default ProfilePage;
