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

  const getStatusColor = (etat) => {
    switch (etat) {
      case "en_attente":
        return "text-yellow-500";
      case "validee":
        return "text-green";
      case "rejetee":
        return "text-red";
      default:
        return "text-gray";
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

        <div className="overflow-auto">
          <table className="w-full overflow-x-auto text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Demandeur</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Etat</th>
                <th className="px-4 py-2">Modifier/Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id_dem_ordre}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">{order.id_dem_ordre}</td>
                  <td className="px-4 py-3">{order.user__username}</td>
                  <td className="px-4 py-3">{order.Date}</td>
                  <td className="px-4 py-3 max-w-xs whitespace-normal break-words">
                    {order.Message_ordre}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${getStatusColor(order.Etat)}`}
                  >
                    {order.Etat}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-center gap-4 text-sky-400">
                    <Eye
                      className="cursor-pointer hover:scale-110"
                      onClick={() => {
                        navigate("/rh/ordremissiondoc");
                      }}
                    />
                    <Trash2 className="cursor-pointer hover:scale-110" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdreMissionTable;
