import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Topbar';

const SuiviDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    status: [],
    date: null
  });
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Récupérer l'email de l'utilisateur depuis le localStorage
  const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

  // Chargement des données au montage du composant
  useEffect(() => {
    if (userEmail) {
      fetchDemandes(userEmail);
    }
  }, [userEmail]);

  // Effet pour la filtration
  useEffect(() => {
    filterDemandes();
  }, [searchTerm, activeFilters, demandes]);

  // Récupérer les demandes depuis l'API
  const fetchDemandes = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/user/demands/', { email });
      const allDemandes = [...response.data.demands.attestations, ...response.data.demands.ordres];
      setDemandes(allDemandes);
      setFilteredDemandes(allDemandes);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      setErrorMessage('Impossible de charger vos demandes. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les demandes selon les critères
  const filterDemandes = () => {
    let result = [...demandes];

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

    // Filtre par statut
    if (activeFilters.status.length > 0) {
      result = result.filter(item => activeFilters.status.includes(item.status));
    }

    // Filtre par date
    if (activeFilters.date) {
      const today = new Date();
      const itemDate = new Date(activeFilters.date);

      switch(activeFilters.date) {
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

    setFilteredDemandes(result);
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Ouvrir le modal de filtre
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Appliquer les filtres
  const applyFilters = (filters) => {
    setActiveFilters(filters);
    setFilterOpen(false);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      type: [],
      status: [],
      date: null
    });
    setFilterOpen(false);
  };

  // Afficher les détails d'une demande
  const viewDemandeDetails = (demande) => {
    setSelectedDemande(demande);
    setShowDetail(true);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Définir la couleur du statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'validée':
        return 'text-green-500';
      case 'en_attente':
        return 'text-amber-500';
      case 'rejetée':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full h-screen pb-4 font-nunito sm:w-[3/4]">
      <Header />
      <div className="bg-blue-50 p-4 md:p-8 min-h-screen w-full">
        <h2 className="text-2xl font-semibold text-cyan-600 mb-8">Suivi des demandes</h2>

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
              placeholder="Search by name, date..."
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
              Filter
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
                <h3 className="font-medium mb-3">Type de demande</h3>
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
                        setActiveFilters({...activeFilters, type: newTypes});
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
                        setActiveFilters({...activeFilters, type: newTypes});
                      }}
                    />
                    <label htmlFor="typeMission">Ordre de mission</label>
                  </div>
                </div>

                <h3 className="font-medium mb-3">Statut</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="statusPending"
                      className="mr-2"
                      checked={activeFilters.status.includes('en_attente')}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...activeFilters.status, 'en_attente']
                          : activeFilters.status.filter(s => s !== 'en_attente');
                        setActiveFilters({...activeFilters, status: newStatus});
                      }}
                    />
                    <label htmlFor="statusPending">En attente</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="statusValidated"
                      className="mr-2"
                      checked={activeFilters.status.includes('validée')}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...activeFilters.status, 'validée']
                          : activeFilters.status.filter(s => s !== 'validée');
                        setActiveFilters({...activeFilters, status: newStatus});
                      }}
                    />
                    <label htmlFor="statusValidated">Validée</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="statusRejected"
                      className="mr-2"
                      checked={activeFilters.status.includes('rejetée')}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...activeFilters.status, 'rejetée']
                          : activeFilters.status.filter(s => s !== 'rejetée');
                        setActiveFilters({...activeFilters, status: newStatus});
                      }}
                    />
                    <label htmlFor="statusRejected">Rejetée</label>
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
                      onChange={() => setActiveFilters({...activeFilters, date: 'today'})}
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
                      onChange={() => setActiveFilters({...activeFilters, date: 'week'})}
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
                      onChange={() => setActiveFilters({...activeFilters, date: 'month'})}
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
                      onChange={() => setActiveFilters({...activeFilters, date: null})}
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

        {/* Tableau des demandes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Demande
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : filteredDemandes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((demande, index) => (
                  <tr key={demande.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => viewDemandeDetails(demande)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {demande.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(demande.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${getStatusColor(demande.status)}`}>
                        {demande.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de détail de la demande */}
        {showDetail && selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-cyan-600">
                  Détails de la demande
                </h3>
                <button onClick={() => setShowDetail(false)} className="text-gray-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Type de demande</p>
                  <p className="font-medium">{selectedDemande.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de demande</p>
                  <p className="font-medium">{formatDate(selectedDemande.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className={`font-medium ${getStatusColor(selectedDemande.status)}`}>
                    {selectedDemande.status}
                  </p>
                </div>
                {selectedDemande.status === 'Rejetée' && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Motif de rejet</p>
                    <p className="font-medium text-red-500">{selectedDemande.rejectReason || 'Non spécifié'}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Contenu de la demande</h4>

                {selectedDemande.type === 'Ordre de mission' ? (
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Nom complet:</span> {selectedDemande.nom_employe}</p>
                    <p><span className="text-gray-500">Département:</span> {selectedDemande.departement}</p>
                    <p><span className="text-gray-500">Poste:</span> {selectedDemande.poste}</p>
                    <p><span className="text-gray-500">Période:</span> Du {formatDate(selectedDemande.date_debut_mission)} au {formatDate(selectedDemande.date_fin_mission)}</p>
                    <p><span className="text-gray-500">Objet de la mission:</span> {selectedDemande.Message_ordre}</p>
                  </div>
                ) : (
                  <div>
                    <p><span className="text-gray-500">Message:</span> {selectedDemande.message || 'Aucun message spécifié'}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetail(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviDemandes;
