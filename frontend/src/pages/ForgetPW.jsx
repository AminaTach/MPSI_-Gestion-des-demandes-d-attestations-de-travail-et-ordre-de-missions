import React, { useState } from "react";
import logo from '../images/ESI-LOGO-black.svg';
import illustration from '../images/login.svg';
import { BsArrowLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/forgot-password/",
                { email },
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            if (data.success) {
                setSuccess('Code de réinitialisation envoyé avec succès.');
                setError('');
                // Rediriger vers la page de réinitialisation de mot de passe
                navigate('/reset-password');
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du code de réinitialisation:", err.response?.data || err.message);
            setError('Échec de l\'envoi du code de réinitialisation.');
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col sm:flex-row items-center justify-center bg-white p-4 font-poppins">
            <div className="absolute top-6 left-8">
                <Link to="/" className="text-text flex items-center gap-1">
                    <BsArrowLeft size={28} className="border border-text text-text rounded-full p-2" /> Retour
                </Link>
            </div>

            <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
                <img src={illustration} alt="Illustration" className="max-w-xs md:max-w-sm lg:max-w-md" />
            </div>

            <div className="w-full md:w-1/2 max-w-md flex flex-col items-center text-center">
                <img src={logo} alt="ESI Logo" className="h-12 mb-6" />
                <h1 className="text-2xl font-semibold text-violet mb-4 sm:mb-20">Mot de passe oublié</h1>
                <p className="text-lg text-start sm:place-self-start text-gray-600 mb-6">
                    Merci de renseigner votre email <strong>@esi.dz</strong>
                </p>

                <form className="w-full space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-start">
                        <label htmlFor="email" className="mb-2 text-lg font-medium text-[#666666]">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="exemple@esi.dz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1"
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <button
                        type="submit"
                        className="w-[150px] mx-auto bg-gradient-to-r from-[#4A90E2] to-[#2D5F8B] text-white py-3 rounded-lg hover:from-[#2D5F8B] hover:to-[#4A90E2] transition-colors duration-300"
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    );
}
