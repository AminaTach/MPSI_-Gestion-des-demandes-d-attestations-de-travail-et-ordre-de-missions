import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CloudDownload, Trash2, Filter } from "lucide-react";
import axios from 'axios';

export default function AttestationsTravail() {
  const [attestations, setAttestations] = useState([]);
  const [filteredAttestations, setFilteredAttestations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAttestations();
  }, []);

  useEffect(() => {
    filterAttestations();
  }, [searchQuery, attestations]);

  const fetchAttestations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/demande-attestation/all/');
      setAttestations(response.data.demandes);
      setFilteredAttestations(response.data.demandes);
    } catch (error) {
      console.error('Erreur lors de la récupération des attestations:', error);
      setErrorMessage('Impossible de charger les attestations. Veuillez réessayer plus tard.');
    }
  };

  const filterAttestations = () => {
    const result = attestations.filter(
      (attestation) =>
        attestation.user__username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attestation.Message_dem_attest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attestation.Date.includes(searchQuery)
    );
    setFilteredAttestations(result);
  };

  const getStatusClass = (etat) => {
    switch (etat) {
      case "En attente":
        return "text-yellow-500";
      case "Validée":
        return "text-green";
      case "Rejetée":
        return "text-red";
      default:
        return "text-gray-500";
    }
  };

  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/attestation/${id}`);
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Attestations de travail</h1>

      {/* Barre de recherche et filtres */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, date..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <span className="text-gray-400 text-sm">⌘ K</span>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5 text-gray-600" />
          <span>Filter</span>
        </button>
      </div>

      {/* Tableau des attestations */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
          <div className="p-4 w-16">S/N</div>
          <div className="p-4">Demandeur</div>
          <div className="p-4">Date</div>
          <div className="p-4">Message</div>
          <div className="p-4">État</div>
          <div className="p-4 text-center">Modifier/Supprimer</div>
        </div>

        {/* Corps du tableau */}
        {filteredAttestations.map((attestation) => (
          <div
            key={attestation.id_dem_attest}
            className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50 text-sm"
          >
            <div className="p-4 w-16">{attestation.id_dem_attest}</div>
            <div className="p-4">{attestation.user__username}</div>
            <div className="p-4">{attestation.Date}</div>
            <div className="p-4">{attestation.Message_dem_attest}</div>
            <div className="p-4">
              <span className={`font-medium ${getStatusClass(attestation.Etat)}`}>
                {attestation.Etat}
              </span>
            </div>
            <div className="p-4 flex items-center justify-center space-x-3">
              <button className="text-blue-500 hover:text-blue-600" onClick={() => handleView(attestation.id_dem_attest)}>
                <Eye className="h-5 w-5" color="#0086CA" />
              </button>
              <button className="text-blue-500 hover:text-blue-600">
                <CloudDownload className="h-5 w-5" color="#0086CA" />
              </button>
              <button className="text-blue-500 hover:text-blue-600">
                <Trash2 className="h-5 w-5" color="#0086CA" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
