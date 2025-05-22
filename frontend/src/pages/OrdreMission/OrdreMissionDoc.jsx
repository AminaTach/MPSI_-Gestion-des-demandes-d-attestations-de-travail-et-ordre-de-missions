import React, { useState, useEffect } from "react";
import Header from "../../components/Topbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrdreMissionDoc = () => {
  const params = useParams();
  const demandeId = params.demandeId;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState({
    id: "",
    demandeur: "",
    date: "",
    message: "",
    etat: "En attente",
  });

  const [formData, setFormData] = useState({
    missionNumber: "",
    year: new Date().getFullYear().toString(),
    name: "",
    position: "",
    fromLocation: "الجزائر",
    toLocation: "جامعة الأغواط",
    transportation: "",
    departureDate: "",
    returnDate: "",
    totalDays: "",
    totalHours: "",
    accommodationNights: "",
    responsibleName: "",
    responsibleFirstName: "",
    identityDocument: "",
    missionPurpose: "",
  });

  useEffect(() => {
    // Only fetch if we have a valid demandeId
    if (demandeId) {
      fetchMissionOrderDetails();
    } else {
      setLoading(false);
      setError("No mission order ID provided. Please check the URL.");
    }
  }, [demandeId]);

  const fetchMissionOrderDetails = async () => {
    try {
      setLoading(true);
      // Make sure demandeId is included in the URL
      const response = await axios.get(`http://localhost:8000/api/mission-orders/${demandeId}/details/`);
      
      if (response.data.success) {
        const { demande, ordre_mission } = response.data;
        
        setOrder({
          id: demande.id,
          demandeur: demande.nom_employe,
          date: new Date(demande.date_debut_mission).toLocaleDateString('fr-FR'),
          message: demande.message || "",
          etat: mapEtat(demande.etat),
        });

        // Calculate days between dates
        const days = calculateDays(demande.date_debut_mission, demande.date_fin_mission);

        setFormData({
          missionNumber: demande.id,
          year: new Date().getFullYear().toString(),
          name: demande.nom_employe,
          position: demande.poste,
          fromLocation: "الجزائر",
          toLocation: demande.departement,
          transportation: ordre_mission ? ordre_mission.moyens_transport : "",
          departureDate: ordre_mission ? ordre_mission.date_depart : demande.date_debut_mission,
          returnDate: ordre_mission ? ordre_mission.date_retour : demande.date_fin_mission,
          totalDays: days.toString(),
          totalHours: "0",
          accommodationNights: (days - 1).toString(),
          responsibleName: ordre_mission ? ordre_mission.nom_responsable : "",
          responsibleFirstName: ordre_mission ? ordre_mission.prenom_responsable : "",
          identityDocument: demande.piece_identite || "",
          missionPurpose: demande.objet_mission || "",
        });
      } else {
        setError("Failed to load mission order details. Invalid response format.");
      }
    } catch (err) {
      console.error("Error fetching mission order details:", err);
      setError(`Failed to load mission order details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check for invalid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Including both start and end days
  };

  const mapEtat = (etat) => {
    switch (etat) {
      case "en_attente":
        return "En attente";
      case "validee":
        return "Validée";
      case "rejetee":
        return "Rejetée";
      default:
        return etat || "En attente";
    }
  };

  const getStatusColor = (etat) => {
    switch (etat) {
      case "En attente":
        return "text-yellow-500";
      case "Validée":
        return "text-green-500";
      case "Rejetée":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!demandeId) {
      setError("Cannot submit - no mission order ID provided.");
      return;
    }
    
    try {
      setLoading(true);
      // Prepare the data for submission
      const submissionData = {
        moyens_transport: formData.transportation,
        date_depart: formData.departureDate,
        date_retour: formData.returnDate,
        date_delivrance: new Date().toISOString().split('T')[0],
        lieu_delivrance: "Alger",
        nom_responsable: formData.responsibleName,
        prenom_responsable: formData.responsibleFirstName,
      };

      // Update mission order details - ensure demandeId is included in the URL
      const response = await axios.post(
        `http://localhost:8000/api/mission-orders/${demandeId}/update-details/`,
        submissionData
      );

      if (response.data.success) {
        alert("Mission order details updated successfully!");
        // Generate PDF if the status is "validee"
        if (order.etat === "Validée") {
          window.open(`http://localhost:8000/api/mission-orders/${demandeId}/generate/`, "_blank");
        }
      } else {
        setError("Failed to update mission order. Server returned an error.");
      }
    } catch (err) {
      console.error("Error updating mission order:", err);
      setError(`Failed to update mission order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!demandeId) {
      setError("Cannot update status - no mission order ID provided.");
      return;
    }
    
    try {
      setLoading(true);
      // Make sure demandeId is included in the URL
      const response = await axios.post(
        `http://localhost:8000/api/mission-orders/${demandeId}/update-status/`,
        { status: newStatus }
      );

      if (response.data.success) {
        setOrder({
          ...order,
          etat: mapEtat(newStatus),
        });
        alert(`Status updated to ${mapEtat(newStatus)}`);
      } else {
        setError("Failed to update status. Server returned an error.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component (UI rendering) remains mostly the same...
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Loading mission order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg max-w-lg">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-4 font-nunito sm:w-[3/4]">
      <Header />
      <div className="grid grid-cols-1 bg-white max-w-6xl mx-4 gap-4 py-8 mt-4 px-4 md:px-8 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">
          Traitement de l'ordre de mission de:
        </h2>

        <div className="overflow-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600">
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Demandeur</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Etat</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-black font-medium">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.demandeur}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2 max-w-xs break-words whitespace-normal">
                  {order.message}
                </td>
                <td className={`px-4 py-2 ${getStatusColor(order.etat)}`}>
                  {order.etat}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange("validee")}
                      className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-xs"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleStatusChange("rejetee")}
                      className="px-2 py-1 bg-red-500 text-white rounded-md text-xs"
                    >
                      Rejeter
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DOC */}

      <div className="max-w-4xl mx-auto mt-12 bg-white p-6 shadow-lg">
        {/* Header with logo and title */}
        <div className="mb-8 text-center">
          <div className="text-base font-bold mb-2">
            REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE
          </div>
          <div className="text-base mb-2" dir="rtl">
            وزارة التعليم العالي والبحث العلمي
          </div>
          <div className="text-base mb-2">
            MINISTERE DE L'ENSEIGNEMENT SUPERIEUR ET DE LA RECHERCHE
            SCIENTIFIQUE
          </div>

          <div className="text-base mb-2" dir="rtl">
            المدرسة الوطنية العليا للإعلام
          </div>
          <div className="text-base mb-4">
            Ecole nationale Supérieure d'Informatique
          </div>

          <div className="flex justify-between items-center">
            <div className="w-1/3">
              <img
                src="https://www.esi.dz/wp-content/uploads/2021/04/ESI-Logo-BG-e1627076162748.png"
                alt="ESI logo"
                className="w-32"
              />
            </div>
            <div className="w-1/3"></div>
            <div className="w-1/3 text-right" dir="rtl">
              <div>المدرسة الوطنية العليا للإعلام</div>
              <div>Ecole nationale Supérieure d'Informatique</div>
            </div>
          </div>
        </div>

        {/* Reference Number */}
        <div className="flex justify-end mb-8">
          <div dir="rtl">
            <span className="ml-2">رقم:</span>
            <span className="inline-block px-4">{formData.missionNumber}</span>
            <span>/</span>
            <span>{formData.year}</span>
          </div>
        </div>

        {/* Mission Title */}
        <div className="text-center text-xl font-bold mb-8" dir="rtl">
          أمر بمهمة
        </div>

        {/* Form content */}
        <div className="space-y-4" dir="rtl">
          <div className="flex items-center">
            <div className="flex-1">إن السيد(ة):</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-1">بأمر السيد(ة):</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="responsibleName"
                value={formData.responsibleName}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
                placeholder="Nom du responsable"
              />
            </div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="responsibleFirstName"
                value={formData.responsibleFirstName}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
                placeholder="Prénom du responsable"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>التابع(ة):</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                value="المدرسة الوطنية العليا للإعلام"
                readOnly
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
            <div>المنصب:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>بالذهاب في مهمة من:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
            <div>الى</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>الموضوع الكامل للمهمة:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="missionPurpose"
                value={formData.missionPurpose}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>وسائل النقل:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>تاريخ الذهاب:</div>
            <div className="flex-1 mx-4">
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>تاريخ الرجوع:</div>
            <div className="flex-1 mx-4">
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assistance request */}
        <div className="my-6" dir="rtl">
          <div>يرجى من السلطات المعنية والعسكرية أن تسهل للسيد(ة):</div>
          <div className="flex items-center mt-2">
            <div>في أداء مهمته(ها)</div>
            <div className="flex-1 mx-12"></div>
          </div>
        </div>

        {/* Identity document */}
        <div className="grid grid-cols-3 gap-4 my-6" dir="rtl">
          <div>وثيقة الهوية:</div>
          <div>
            <input
              type="text"
              name="identityDocument"
              value={formData.identityDocument}
              onChange={handleChange}
              className="border-b border-gray-400 w-full outline-none"
            />
          </div>
          <div>رقم:</div>
        </div>

        {/* Total transportation time */}
        <div className="grid grid-cols-6 border-b border-gray-400 my-6">
          <div className="col-span-1 p-2 text-right" dir="rtl">
            مجموع مدة التنقل:
          </div>
          <div className="col-span-1 p-2 text-center border-r border-gray-400">
            <input
              type="text"
              name="totalDays"
              value={formData.totalDays}
              onChange={handleChange}
              className="w-full outline-none text-center"
            />
          </div>

          <div
            className="col-span-1 p-2 text-center border-r border-gray-400"
            dir="rtl"
          >
            أيام:
          </div>

          <div className="col-span-1 p-2 text-center border-r border-gray-400">
            <input
              type="text"
              name="totalHours"
              value={formData.totalHours}
              onChange={handleChange}
              className="w-full outline-none text-center"
            />
          </div>
          <div
            className="col-span-1 p-2 text-center border-r border-gray-400"
            dir="rtl"
          >
            ساعات:
          </div>
        </div>

        {/* Accommodation nights */}
        <div className="grid grid-cols-2 border-b border-gray-400 my-6">
          <div
            className="col-span-1 p-2 text-right border-r border-gray-400"
            dir="rtl"
          >
            عدد الليالي في ضيافة المصلحة المستقبلة:
          </div>
          <div className="col-span-1 p-2 text-center">
            <input
              type="text"
              name="accommodationNights"
              value={formData.accommodationNights}
              onChange={handleChange}
              className="w-full outline-none text-center"
            />
          </div>
        </div>

        {/* Footer with contact information */}
        <div className="mt-8 text-center text-sm">
          <div>
            ESI (Ecole nationale Supérieure d'Informatique) BP 68M, 16059, Oued
            Smar, Algérie
          </div>
          <div>Tél : 023.93.91.32 Fax : 023.93.91.34 ; http://www.esi.dz</div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={handleSubmit}
            className="bg-[#0086CA] hover:bg-[#244e74] text-white font-semibold px-8 py-2 rounded-3xl"
          >
            Enregistrer
          </button>
          {order.etat === "Validée" && (
            <button 
              onClick={() => window.open(`http://localhost:8000/api/mission-orders/${demandeId}/generate/`, "_blank")}
              className="bg-[#22c55e] hover:bg-[#15803d] text-white font-semibold px-8 py-2 rounded-3xl"
            >
              Générer PDF
            </button>
          )}
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded-3xl"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdreMissionDoc;