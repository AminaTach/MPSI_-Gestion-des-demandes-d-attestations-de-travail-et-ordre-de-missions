// src/components/Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Topbar";
import { Plus, Pencil, Trash, Filter, Search } from "lucide-react";

const OrdreMissionTable = () => {
  const navigate = useNavigate();
  const [orders] = useState([
    {
      id: "01",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Message",
      etat: "En attente",
    },
    {
      id: "02",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Message",
      etat: "Validée",
    },
    {
      id: "03",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Message",
      etat: "En attente",
    },
    {
      id: "04",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Message",
      etat: "Rejetée",
    },
  ]);

  const getStatusColor = (etat) => {
    switch (etat) {
      case "En attente":
        return "text-yellow-500";
      case "Validée":
        return "text-green";
      case "Rejetée":
        return "text-red";
      default:
        return "text-gray";
    }
  };

  return (
    <div className="w-full pb-4 font-nunito sm:w-[3/4]  ">
      <Header />
      <div class="h-10"></div>
      <div className="p-6 bg-white rounded-3xl shadow-md max-w-6xl mx-auto">
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
          <table className="min-w-full text-sm text-left">
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
                  key={order.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.demandeur}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    {order.message}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${getStatusColor(
                      order.etat
                    )}`}
                  >
                    {order.etat}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-4 text-sky-400">
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
