import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Search, Eye, CloudDownload, Trash2, Filter } from "lucide-react";

export default function RH_docs() {
  // État pour stocker les attestations (données statiques en exemple)
  const [attestations, setAttestations] = useState([
    {
      id: "01",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Pour un prêt bancaire",
      etat: "En attente",
    },
    {
      id: "02",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Pour un prêt bancaire",
      etat: "Validée",
    },
    {
      id: "03",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Pour un prêt bancaire",
      etat: "En attente",
    },
    {
      id: "04",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Pour un prêt bancaire",
      etat: "Rejetée",
    },
    {
      id: "05",
      demandeur: "SI SABER Rania",
      date: "23/04/2003",
      message: "Pour un prêt bancaire",
      etat: "Rejetée",
    },
  ]);

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction pour obtenir la classe CSS correspondant à l'état
  const getStatusClass = (etat) => {
    switch (etat) {
      case "En attente":
        return "text-yellow-500";
      case "Validée":
        return "text-green";
      case "Rejetée":
        return "text-red";
    }
  };

  // Filtrer les attestations selon la recherche
  const filteredAttestations = attestations.filter(
    (attestation) =>
      attestation.demandeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attestation.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attestation.date.includes(searchQuery)
  );
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
          <div className="p-4">Etat</div>
          <div className="p-4 text-center">Modifier/Supprimer</div>
        </div>

        {/* Corps du tableau */}
        {filteredAttestations.map((attestation) => (
          <div
            key={attestation.id}
            className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50 text-sm"
          >
            <div className="p-4 w-16">{attestation.id}</div>
            <div className="p-4">{attestation.demandeur}</div>
            <div className="p-4">{attestation.date}</div>
            <div className="p-4">{attestation.message}</div>
            <div className="p-4">
              <span
                className={`font-medium ${getStatusClass(attestation.etat)}`}
              >
                {attestation.etat}
              </span>
            </div>
            <div className="p-4 flex items-center justify-center space-x-3">
              <button className="text-blue-500 hover:text-blue-600">
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
    </div>
  );
}
