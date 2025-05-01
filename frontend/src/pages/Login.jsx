// LoginPage.jsx
import React from "react";
import login from '../images/login.svg'
import logo from '../images/ESI-LOGO-black.svg'
import go from '../images/google.svg'
import { Link } from "react-router-dom";


export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center font-poppins bg-white p-4">


            <div className="w-full md:w-1/2 flex justify-center mb-10 sm:mb-20">
                <img
                    src={login}
                    alt="Attestation Illustration"
                    className="max-w-xs md:max-w-sm lg:max-w-md"
                />
            </div>


            <div className="w-full flex flex-col  md:w-1/2 max-w-md ">

                <div className="text-center mb-6">
                    <img src={logo} alt="ESI Logo" className="mx-auto h-12" />
                    <h1 className="text-2xl font-semibold font-poppins  text-violet mt-6">Connexion</h1>
                </div>
                <form className="space-y-4 px-2">
                    <div>
                        <label className="mb-2 text-base font-poppins font-medium text-grey">
                            Utilisateur
                        </label>
                        <input
                            type="text"

                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-1"
                        />
                    </div>
                    <div className="relative ">
                        <label className="mb-2 text-base font-poppins font-medium text-grey">
                            Mot de passe
                        </label>
                        <input
                            type="password"

                            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring focus:ring-1"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">

                        </span>
                    </div>
                    <div className="text-right">
                        <Link to={"/forgetpassword"} className="text-sm text-slate-800 underline">
                            Mot de passe oublié?
                        </Link>
                    </div>
                    <button
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
                <button
                    onClick={() => {
                        window.location.href = "http://localhost:8000/google/login/";
                    }}
                    className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
                >
                    <img
                        src={go}
                        alt="Google Logo"
                        className="h-5 w-5"
                    />
                    Connexion avec Google @esi.dz
                </button>

            </div>
        </div>
    );
}
