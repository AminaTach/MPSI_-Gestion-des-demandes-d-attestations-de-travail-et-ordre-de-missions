// src/components/Dashboard.js
import React, { useState } from "react";
import Header from "../../components/Topbar";

const OrdreMissionDoc = () => {
  const order = {
    id: "01",
    demandeur: "Laouar Boutheyna",
    date: "25/03/2025",
    message: "message",
    etat: "En attente",
  };

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
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">
          Traitement de l’ordre de mission de:
        </h2>

        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600">
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Demandeur</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Etat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-black font-medium">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.demandeur}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">{order.message}</td>
                <td className={`px-4 py-2 ${getStatusColor(order.etat)}`}>
                  {order.etat}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdreMissionDoc;
