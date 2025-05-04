import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  FileText,
  CloudDownload,
} from "lucide-react";

export default function RH_docs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("attestation");

  const [attestations, setAttestations] = useState([
    { id: "01", demandeur: "Laouar Boutheyna", date: "25/03/2025" },
    { id: "02", demandeur: "Laouar Boutheyna", date: "25/03/2025" },
    { id: "03", demandeur: "Laouar Boutheyna", date: "25/03/2025" },
    { id: "04", demandeur: "Laouar Boutheyna", date: "25/03/2025" },
  ]);

  const [ordresMission, setOrdresMission] = useState([
    {
      id: "01",
      demandeur: "Dupont Jean",
      date: "15/04/2025",
    },
    {
      id: "02",
      demandeur: "Martin Sophie",
      date: "18/04/2025",
    },
    {
      id: "03",
      demandeur: "Bernard Alain",
      date: "22/04/2025",
    },
  ]);

  const filteredAttestations = attestations.filter(
    (att) =>
      att.demandeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.date.includes(searchQuery)
  );

  const filteredOrdresMission = ordresMission.filter(
    (ordre) =>
      ordre.demandeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ordre.date.includes(searchQuery)
  );

  const handleAddNew = () => {
    console.log(`Ajouter un nouveau ${activeTab}`);
  };

  const handleEdit = (id) => {
    console.log(`Modifier ${activeTab} ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Supprimer ${activeTab} ${id}`);
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#2D5F8B]">Mes Documents</h1>

      <div className="relative mb-8">
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
      </div>

      <div className="flex border-b w-full justify-center items-center border-gray-200 mb-6">
        <div className="w-1/2">
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "attestation"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("attestation")}
          >
            Attestation de travail
          </button>
        </div>
        <div className="w-1/2">
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "mission"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("mission")}
          >
            Ordre de mission
          </button>
        </div>
      </div>

      {activeTab === "attestation" ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="grid grid-cols-4 gap-10">
              <div className="p-4 ">S/N</div>
              <div className="p-4 ">Demandeur</div>
              <div className="p-4 ">Date</div>
              <div className="p-4 text-center">Actions</div>
            </div>
          </div>

          {filteredAttestations.map((attestation) => (
            <div
              key={attestation.id}
              className="grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 text-sm"
            >
              <div className="p-4">{attestation.id}</div>
              <div className="p-4">{attestation.demandeur}</div>
              <div className="p-4">{attestation.date}</div>
              <div className="p-4 flex items-center justify-center space-x-3">
                <button
                  onClick={() => handleDelete(attestation.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <CloudDownload className="h-5 w-5" color="#0086CA" />
                </button>
                <button
                  onClick={() => handleEdit(attestation.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit className="h-5 w-5" color="#0086CA" />
                </button>
                <button
                  onClick={() => handleDelete(attestation.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Trash2 className="h-5 w-5" color="#0086CA" />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 text-sm">
            <div className="p-4">05</div>
            <div className="p-4 font-semibold">Nouvelle attestation...</div>
            <div className="p-4">Date d'aujourd'hui</div>
            <div className="p-4 flex items-center justify-center">
              <button
                onClick={handleAddNew}
                className="text-blue-500 hover:text-blue-600"
              >
                <Plus className="h-5 w-5" color="#0086CA" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="grid grid-cols-5">
              <div className="p-4 w-1/6">S/N</div>
              <div className="p-4 w-1/4">Demandeur</div>
              <div className="p-4 w-1/4">Date</div>
              <div className="p-4 w-1/6 text-center">Actions</div>
            </div>
          </div>

          {filteredOrdresMission.map((ordre) => (
            <div
              key={ordre.id}
              className="grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 text-sm"
            >
              <div className="p-4">{ordre.id}</div>
              <div className="p-4">{ordre.demandeur}</div>
              <div className="p-4">{ordre.date}</div>
              <div className="p-4 flex items-center justify-center space-x-3">
                <button
                  onClick={() => handleDelete(ordre.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <CloudDownload className="h-5 w-5" color="#0086CA" />
                </button>
                <button
                  onClick={() => handleEdit(ordre.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit className="h-5 w-5" color="#0086CA" />
                </button>
                <button
                  onClick={() => handleDelete(ordre.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Trash2 className="h-5 w-5" color="#0086CA" />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 text-sm">
            <div className="p-4">04</div>
            <div className="p-4 font-semibold">Nouvel ordre de mis...</div>
            <div className="p-4">Date d'aujourd'hui</div>
            <div className="p-4 flex items-center justify-center">
              <button
                onClick={handleAddNew}
                className="text-blue-500 hover:text-blue-600"
              >
                <Plus className="h-5 w-5" color="#0086CA" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
