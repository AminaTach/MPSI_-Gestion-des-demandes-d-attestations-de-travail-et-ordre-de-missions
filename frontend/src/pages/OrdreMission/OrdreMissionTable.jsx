import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Topbar";
import { Plus, Pencil, Trash, Filter, Search } from "lucide-react";

const OrdreMissionTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/demande-ordre-mission/all/');
        setOrders(response.data.demandes);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'ordre de mission:', error);
        setErrorMessage('Une erreur est survenue lors de la récupération des demandes. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
            />
            <span className="text-xs text-gray-400 ml-2">⌘ K</span>
          </div>
          <button className="flex items-center border rounded-lg px-4 py-2 shadow-sm text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
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
              {orders.map((order) => (
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
                    <Plus
                      className="cursor-pointer hover:scale-110 z-10"
                      onClick={() => {
                        navigate("/rh/ordremissionform");
                      }}
                    />
                    <Pencil
                      className="cursor-pointer hover:scale-110"
                      onClick={() => {
                        navigate("/rh/ordremissiondoc");
                      }}
                    />
                    <Trash className="cursor-pointer hover:scale-110" />
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
