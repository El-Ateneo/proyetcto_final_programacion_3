import React, { useState, useEffect } from 'react';
//import { useAuth } from '../contexts/AuthContext';
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

    console.log("datos del usuario: ", profile)

    if (!profile) return <div>Loading...</div>;
    const profileImageUrl = `https://sandbox.academiadevelopers.com${profile.image}`;

    return (
        <div className="profile-page">
            <h1>Mi Perfil</h1>
            <div className="profile-container">
                <div className="profile-image">

                    <figure class="image is-128x128">
                        <img class="is-rounded"  src= {profileImageUrl} alt="User Profile"/>
                    </figure>
                </div>
                <div className="profile-info">
                    <p>Nombre de Usuario: {profile.username}</p>
                    <p>Nombre: {profile.first_name}</p>
                    <p>Apellido: {profile.last_name}</p>
                    <p>Email: {profile.email}</p>
                    <p>Fecha de Nacimiento: {profile.dob ? profile.dob : 'No proporcionada'}</p>
                    <p>Biografía: {profile.bio ? profile.bio : 'No proporcionada'}</p>
                    <p>Estado: {profile.state ? profile.state.name : 'No proporcionado'}</p>
                    <p>Creado el: {new Date(profile.created_at).toLocaleString()}</p>
                    <p>Actualizado el: {new Date(profile.updated_at).toLocaleString()}</p>
                    <button className="button is-primary" onClick={handleEditClick}>
                        Editar Perfil
                    </button>
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
};


export default ProfilePage;