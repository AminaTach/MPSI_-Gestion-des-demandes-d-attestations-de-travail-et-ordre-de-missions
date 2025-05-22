import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Topbar';

const TelechargerDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    date: null
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Récupérer l'email de l'utilisateur depuis le localStorage
  const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

  // Chargement des données au montage du composant
  useEffect(() => {
    if (userEmail) {
      fetchDocuments(userEmail);
    }
  }, [userEmail]);

  // Effet pour la filtration
  useEffect(() => {
    filterDocuments();
  }, [searchTerm, activeFilters, documents]);

  // Récupérer les documents depuis l'API
  const fetchDocuments = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/user/documents/', { email });
      const allDocuments = [...response.data.documents.attestations, ...response.data.documents.ordres];
      setDocuments(allDocuments);
      setFilteredDocuments(allDocuments);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      setErrorMessage('Impossible de charger vos documents. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les documents selon les critères
  const filterDocuments = () => {
    let result = [...documents];

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(item =>
        item.id.toString().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(item.date).toLocaleDateString().includes(searchTerm)
      );
    }

    // Filtre par type
    if (activeFilters.type.length > 0) {
      result = result.filter(item => activeFilters.type.includes(item.type));
    }

    // Filtre par date
    if (activeFilters.date) {
      const today = new Date();

      switch (activeFilters.date) {
        case 'today':
          result = result.filter(item => {
            const date = new Date(item.date);
            return date.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          result = result.filter(item => {
            const date = new Date(item.date);
            return date >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          result = result.filter(item => {
            const date = new Date(item.date);
            return date >= monthAgo;
          });
          break;
        default:
          break;
      }
    }

    setFilteredDocuments(result);
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Ouvrir le modal de filtre
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      type: [],
      date: null
    });
    setFilterOpen(false);
  };

  // Télécharger un document
  // Fonction pour télécharger un ordre de mission
  const downloadDocument = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/mission-orders/${orderId}/generate/`,
        { responseType: 'blob' }
      );

      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordre_mission_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour télécharger une attestation de travail
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

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="w-full h-screen pb-4 font-nunito sm:w-[3/4]">
      <Header />
      <div className="bg-blue-50 p-4 md:p-8 min-h-screen w-full">
        <h2 className="text-2xl font-semibold text-cyan-600 mb-8">Télécharger mes documents</h2>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom, date..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">
              K
            </span>
          </div>
          <div className="relative">
            <button
              onClick={toggleFilter}
              className="bg-white border border-gray-300 px-6 py-2 rounded-md flex items-center gap-2"
            >
              Filtrer
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>

            {/* Menu de filtre */}
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                <h3 className="font-medium mb-3">Type de document</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="typeAttestation"
                      className="mr-2"
                      checked={activeFilters.type.includes('Attestation de travail')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...activeFilters.type, 'Attestation de travail']
                          : activeFilters.type.filter(t => t !== 'Attestation de travail');
                        setActiveFilters({ ...activeFilters, type: newTypes });
                      }}
                    />
                    <label htmlFor="typeAttestation">Attestation de travail</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="typeMission"
                      className="mr-2"
                      checked={activeFilters.type.includes('Ordre de mission')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...activeFilters.type, 'Ordre de mission']
                          : activeFilters.type.filter(t => t !== 'Ordre de mission');
                        setActiveFilters({ ...activeFilters, type: newTypes });
                      }}
                    />
                    <label htmlFor="typeMission">Ordre de mission</label>
                  </div>
                </div>

                <h3 className="font-medium mb-3">Période</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dateToday"
                      name="dateFilter"
                      className="mr-2"
                      checked={activeFilters.date === 'today'}
                      onChange={() => setActiveFilters({ ...activeFilters, date: 'today' })}
                    />
                    <label htmlFor="dateToday">Aujourd'hui</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dateWeek"
                      name="dateFilter"
                      className="mr-2"
                      checked={activeFilters.date === 'week'}
                      onChange={() => setActiveFilters({ ...activeFilters, date: 'week' })}
                    />
                    <label htmlFor="dateWeek">Cette semaine</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dateMonth"
                      name="dateFilter"
                      className="mr-2"
                      checked={activeFilters.date === 'month'}
                      onChange={() => setActiveFilters({ ...activeFilters, date: 'month' })}
                    />
                    <label htmlFor="dateMonth">Ce mois</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dateAll"
                      name="dateFilter"
                      className="mr-2"
                      checked={activeFilters.date === null}
                      onChange={() => setActiveFilters({ ...activeFilters, date: null })}
                    />
                    <label htmlFor="dateAll">Toutes les dates</label>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={resetFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded-md"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            {errorMessage}
          </div>
        )}

        {/* Tableau des documents */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun document trouvé
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(document.id).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {document.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                      Validée
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          if (document.type === 'Ordre de mission') {
                            downloadDocument(document.id);
                          } else if (document.type === 'Attestation de travail') {
                            handleDownload(document.id);
                          }
                        }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                          <path d="M12 2v13m0 0l-3-3m3 3l3-3M3 17v5h18v-5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default TelechargerDocuments;
