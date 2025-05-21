import React, { useState } from "react";
import login from '../images/login.svg';
import logo from '../images/ESI-LOGO-black.svg';
import go from '../images/google.svg';
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/login/",
                { identifier, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            console.log("Réponse du backend:", data);

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data));

                if (data.user_type === "rh") {
                    navigate("/rh/dashboard");
                } else {
                    navigate("/employee/demande");
                }
            }
        } catch (err) {
            console.error("Erreur lors de la connexion:", err.response?.data || err.message);
            setError("Vérifier vos informations de connexion");
        }
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center font-poppins bg-white p-4">
            <div className="w-full md:w-1/2 flex justify-center mb-10 sm:mb-20">
                <img
                    src={login}
                    alt="Attestation Illustration"
                    className="max-w-xs md:max-w-sm lg:max-w-md"
                />
            </div>

            <div className="w-full flex flex-col md:w-1/2 max-w-md">
                <div className="text-center mb-6">
                    <img src={logo} alt="ESI Logo" className="mx-auto h-12" />
                    <h1 className="text-2xl font-semibold font-poppins text-violet mt-6">Connexion</h1>
                </div>
                <form className="space-y-4 px-2" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 text-base font-poppins font-medium text-grey">
                            Utilisateur
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1"
                        />
                    </div>
                    <div className="relative">
                        <label className="mb-2 text-base font-poppins font-medium text-grey">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-1"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
                        </span>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="text-right">
                        <Link to={"/forgetpassword"} className="text-sm text-slate-800 underline">
                            Mot de passe oublié?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center mx-auto bg-gradient-to-r from-[#4A90E2] to-[#2D5F8B] text-white py-4 px-8 rounded-lg border-2 border-[#2D5F8B] hover:from-[#2D5F8B] hover:to-[#4A90E2] transition-colors duration-300"
                        style={{ width: '150px', height: '46px', borderRadius: '18px', borderWidth: '1px' }}
                    >
                        Connexion
                    </button>
                </form>
                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 w-1/3" />
                    <span className="mx-2 text-gray-500">Ou</span>
                    <div className="border-t border-gray-300 w-1/3" />
                </div>
                <GoogleLogin
                    clientId="318367454563-v857090khdr2rk94jff2apmh0ifq7irh.apps.googleusercontent.com"
                    onSuccess={async (credentialResponse) => {
                        const { credential } = credentialResponse;
                        if (!credential) return;

                        try {
                            const response = await axios.post(
                                "http://localhost:8000/api/google-login/",
                                { token: credential },
                                { headers: { "Content-Type": "application/json" } }
                            );

                            const data = response.data;
                            console.log("Réponse du backend:", data);

                            if (data.success) {
                                localStorage.setItem("user", JSON.stringify(data));

                                if (data.user_type === "rh") {
                                    navigate("/rh/dashboard");
                                } else {
                                    navigate("/employee/demande");
                                }
                            }
                        } catch (err) {
                            console.error("Erreur lors de la connexion:", err.response?.data || err.message);
                            setError("Vérifier vos informations de connexion");
                        }
                    }}
                    onError={() => {
                        console.error("Échec de l'authentification Google");
                        setError("Échec de l'authentification Google");
                    }}
                    useOneTap
                />
            </div>
        </div>
    );
}
