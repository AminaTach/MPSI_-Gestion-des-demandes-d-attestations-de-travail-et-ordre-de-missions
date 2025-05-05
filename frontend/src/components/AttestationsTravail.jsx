import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CloudDownload, Trash2, Filter } from "lucide-react";
import axios from 'axios';

export default function AttestationsTravail() {
  const [attestations, setAttestations] = useState([]);
  const [filteredAttestations, setFilteredAttestations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAttestations();
  }, []);

  useEffect(() => {
    filterAttestations();
  }, [searchQuery, attestations]);

  const fetchAttestations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/demande-attestation/all/');
      setAttestations(response.data.demandes);
      setFilteredAttestations(response.data.demandes);
      setErrorMessage("");
    } catch (error) {
      console.error('Erreur lors de la récupération des attestations:', error);
      setErrorMessage('Impossible de charger les attestations. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
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

  const getStatusBadge = (etat) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
    switch (etat.toLowerCase()) {
      case "en attente":
      case "en_attente":
        return (
          <span className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`}>
            En attente
          </span>
        );
      case "validée":
      case "validee":
        return (
          <span className={`${baseClasses} bg-emerald-50 text-green-700 border border-emerald-200`}>
            Validée
          </span>
        );
      case "rejetée":
      case "rejetee":
        return (
          <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>
            Rejetée
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}>
            {etat}
          </span>
        );
    }
  };

  const navigate = useNavigate();

  const handleView = (id) => {
   
    navigate(`/ViewAttes/${id}`);
  };

  const handleDownload = async (id) => {
    setIsLoading(true);
    try {
      console.log(`Attempting to download attestation ${id}`);
      
      // Make a request to generate and download the PDF
      const response = await axios.get(`http://localhost:8000/api/attestations/${id}/generate/`, {
        responseType: 'blob', // Important for file downloads
      });
      
      console.log('Download response received', response.status);
      
      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attestation_travail_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setSuccessMessage("Attestation téléchargée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      console.error('Error details:', error.response || error.message);
      
      if (error.response?.status === 400) {
        setErrorMessage('Cette attestation n\'est pas encore validée.');
      } else {
        setErrorMessage(`Erreur lors du téléchargement de l'attestation: ${error.message}`);
      }
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande d'attestation ?")) {
      setIsLoading(true);
      try {
        const response = await axios.delete(`http://localhost:8000/api/attestations/${id}/delete/`);
        
        if (response.data.success) {
          setSuccessMessage("Attestation supprimée avec succès");
          // Remove the deleted attestation from state
          setAttestations(prev => prev.filter(att => att.id_dem_attest !== id));
          setFilteredAttestations(prev => prev.filter(att => att.id_dem_attest !== id));
        } else {
          setErrorMessage(response.data.message || "Erreur lors de la suppression de l'attestation");
        }
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrorMessage(error.response?.data?.message || "Erreur lors de la suppression de l'attestation");
        setTimeout(() => setErrorMessage(""), 5000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Attestations de travail</h1>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
          {errorMessage}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-blue-200"></div>
        </div>
      )}

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
          <div className="p-4 text-center">Actions</div>
        </div>

        {/* Corps du tableau */}
        {filteredAttestations.length > 0 ? (
          filteredAttestations.map((attestation) => (
            <div
              key={attestation.id_dem_attest}
              className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50 text-sm"
            >
              <div className="p-4 w-16">{attestation.id_dem_attest}</div>
              <div className="p-4">{attestation.user__username}</div>
              <div className="p-4">{attestation.Date}</div>
              <div className="p-4">{attestation.Message_dem_attest}</div>
              <div className="p-4">
                {getStatusBadge(attestation.Etat)}
              </div>
              <div className="p-4 flex items-center justify-center space-x-3">
                <button 
                  className="text-blue-500 hover:text-blue-600" 
                  onClick={() => handleView(attestation.id_dem_attest)}
                  title="Voir les détails"
                >
                  <Eye className="h-5 w-5" color="#0086CA" />
                </button>
                <button 
                  className="text-blue-500 hover:text-blue-600" 
                  onClick={() => handleDownload(attestation.id_dem_attest)}
                  title="Télécharger l'attestation"
                  disabled={!["validée", "validee"].includes(attestation.Etat.toLowerCase())}
                >
                  <CloudDownload 
                    className="h-5 w-5" 
                    color={["validée", "validee"].includes(attestation.Etat.toLowerCase()) ? "#0086CA" : "#AAAAAA"} 
                  />
                </button>
                <button 
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => handleDelete(attestation.id_dem_attest)}
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" color="#0086CA" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "Aucune attestation ne correspond à votre recherche." : "Aucune attestation disponible."}
          </div>
        )}
      </div>
    </div>
  );
}