import React, { useState, useEffect } from 'react';
import { FaRegSmile, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Topbar() {
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer les informations de l'utilisateur depuis le localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUserName(userData.name);
            setUserImage(userData.picture);
        }

        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(today.toLocaleDateString('fr-FR', options));
    }, []);

    const goBack = () => {
        navigate(-1); // Revenir à la page précédente
    };

    return (
        <div className="flex items-center justify-between bg-blue_top pr-8 pl-4 sm:pl-8 py-4">
            <div className="flex items-start">
                <button onClick={goBack} className="mr-4 mt-2">
                    <FaArrowLeft />
                </button>
                <div className="flex justify-center flex-col text-start">
                    <div className="flex items-center">
                        <span className="font-bold text-title text-lg">Bienvenue, {userName}</span>
                        <FaRegSmile className="ml-2" />
                    </div>
                    <div className="flex items-center text-text">
                        <span>Aujourd'hui, c'est le {currentDate}.</span>
                    </div>
                </div>
            </div>

            <div className="hidden sm:flex items-center ml-4">
                <img src={userImage} alt="User Profile" className="w-10 h-10 rounded-full ml-2" />
            </div>
        </div>
    );
}

export default Topbar;
