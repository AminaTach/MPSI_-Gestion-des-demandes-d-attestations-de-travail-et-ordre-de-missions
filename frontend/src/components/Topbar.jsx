import React, { useState } from 'react'
import { FaRegSmile, FaRegCalendarAlt, FaRegUser } from 'react-icons/fa';

function Topbar() {
    const userName = useState('Lotmani Reda')
    return (

        <div className="flex items-center justify-between bg-blue_top pr-8 pl-8 sm:pl-16 py-4">
            <div className="flex justify-center flex-col text-start">
                <div className="flex items-center">
                
                    <span className="font-bold text-title text-lg">Bienvenue, M.{userName}</span>
                    <FaRegSmile className="ml-2" />
                </div>
                <div className="flex items-center text-text">
                    
                    <span>Aujourd'hui, c'est le jeudi 27 mars 2025.</span>
                </div>
            </div>

            <div className="hidden sm:flex items-center ml-4">
                <FaRegUser className="mr-2" />
                <span>Profil</span>
            </div>
        </div>
    );
};



export default Topbar