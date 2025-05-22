import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Topbar";
import { Search, Eye, CloudDownload, Trash2, Filter } from "lucide-react";

const OrdreMissionTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    status: [],
    date: null,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/demande-ordre-mission/all/');
        setOrders(response.data.demandes);
        setFilteredOrders(response.data.demandes);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'ordre de mission:', error);
        setErrorMessage('Une erreur est survenue lors de la récupération des demandes. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let results = orders;

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(order =>
        order.user__username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.Date.includes(searchTerm) ||
        order.Message_ordre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilters.status.length > 0) {
      results = results.filter(order =>
        activeFilters.status.includes(order.Etat)
      );
    }

    // Apply date filter
    if (activeFilters.date) {
      const now = new Date();
      results = results.filter(order => {
        const orderDate = new Date(order.Date);
        if (activeFilters.date === 'today') {
          return orderDate.toDateString() === now.toDateString();
        } else if (activeFilters.date === 'week') {
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          return orderDate >= startOfWeek;
        } else if (activeFilters.date === 'month') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return orderDate >= startOfMonth;
        }
        return true;
      });
    }

    setFilteredOrders(results);
  }, [searchTerm, activeFilters, orders]);

  const resetFilters = () => {
    setActiveFilters({
      type: [],
      status: [],
      date: null,
    });
  };

  const getStatusBadge = (etat) => {
    switch (etat.toLowerCase()) {
      case "en_attente":
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            En attente
          </span>
        );
      case "validée":
      case "validee":
        return (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Validée
          </span>
        );
      case "rejetée":
      case "rejetee":
        return (
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            Rejetée
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
            {etat}
          </span>
        );
    }
  };

  // Fonction pour télécharger un ordre de mission
  const downloadMissionOrder = async (orderId) => {
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

  // Fonction pour supprimer un ordre de mission
  const deleteMissionOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande d\'ordre de mission ?')) {
      try {
        setIsLoading(true);
        await axios.post(`http://localhost:8000/api/mission-orders/${orderId}/delete/`);
        
        // Mettre à jour la liste après suppression
        setOrders(orders.filter(order => order.id_dem_ordre !== orderId));
        alert('Demande d\'ordre de mission supprimée avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="w-full pb-4 font-nunito sm:w-[3/4]">
      <Header />
      <div className="grid grid-cols-1 bg-white max-w-6xl mx-4 gap-4 py-8 mt-4 px-4 md:px-8 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Ordres de missions</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center border rounded-lg px-4 py-2 flex-grow max-w-md shadow-sm">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, date..."
              className="flex-grow outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="text-xs text-gray-400 ml-2">⌘ K</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center border rounded-lg px-4 py-2 shadow-sm text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            {/* Menu de filtre */}
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
               
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

        {/* Tableau des ordres de mission */}
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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id_dem_ordre}
                className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50 text-sm"
              >
                <div className="p-4 w-16">{order.id_dem_ordre}</div>
                <div className="p-4">{order.user__username}</div>
                <div className="p-4">{order.Date}</div>
                <div className="p-4 truncate max-w-xs" title={order.Message_ordre}>
                  {order.Message_ordre}
                </div>
                <div className="p-4">
                  {getStatusBadge(order.Etat)}
                </div>
                <div className="p-4 flex items-center justify-center space-x-3">
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => navigate(`/rh/ordremissiondoc/${order.id_dem_ordre}`)}
                    title="Voir les détails"
                  >
                    <Eye className="h-5 w-5" color="#0086CA" />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    title="Télécharger l'ordre de mission"
                    disabled={!["validée", "validee"].includes(order.Etat.toLowerCase())}
                    onClick={() => {
                      if (["validée", "validee"].includes(order.Etat.toLowerCase())) {
                        downloadMissionOrder(order.id_dem_ordre);
                      }
                    }}
                  >
                    <CloudDownload
                      className="h-5 w-5"
                      color={["validée", "validee"].includes(order.Etat.toLowerCase()) ? "#0086CA" : "#AAAAAA"}
                    />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    title="Supprimer"
                    onClick={() => deleteMissionOrder(order.id_dem_ordre)}
                  >
                    <Trash2 className="h-5 w-5" color="#0086CA" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "Aucun ordre de mission ne correspond à votre recherche." : "Aucun ordre de mission disponible."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdreMissionTable;