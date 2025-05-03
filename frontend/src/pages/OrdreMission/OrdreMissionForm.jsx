import React, { useState } from "react";
import Header from "../../components/Topbar";

const OrdreMissionForm = () => {
  const [formData, setFormData] = useState({
    nomme: "",
    ordonne: "",
    departement: "",
    poste: "",
    dateDebut: "",
    dateFin: "",
    objet: "",
    transport: "",
    dateRetour: "",
    missionA: "",
    identite: "",
    dateDelivrance: "",
    lieuDelivrance: "",
    responsable: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        alert(`Veuillez remplir le champ: ${key}`);
        return;
      }
    }
    alert("Formulaire envoyé avec succès");
  };

  return (
    <div className="w-full pb-4 font-nunito sm:w-[3/4] ">
      <Header />
      <div className="h-2"></div>
      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-[#2D5F8B] mb-6 flex justify-center space-x-2 rtl:space-x-reverse">
          <span>Ordre de mission</span>
          <span>أمر بمهمة</span>
        </h1>

        <form className="space-y-4 rtl:text-right" onSubmit={handleSubmit}>
          {/* Nommé */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Le(la) nommé(e):</span>
              <span>إن السيد(ة):</span>
            </div>
            <input
              required
              name="nomme"
              value={formData.nomme}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Ordonne */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Ordonne M./Mme :</span>
              <span>يأمر السيد(ة):</span>
            </div>
            <input
              required
              name="ordonne"
              value={formData.ordonne}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Département / Poste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-gray-400 font-medium mb-1">
                <span>Département :</span>
                <span>التابع(ة):</span>
              </div>
              <input
                required
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-gray-400 font-medium mb-1">
                <span>Poste:</span>
                <span>المنصب:</span>
              </div>
              <input
                required
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Est chargé(e) d’effectuer une mission du</span>
              <span>بالذهاب في مهمة من</span>
              <span>إلى:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <input
                required
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Date de retour */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Date de retour :</span>
              <span>تاريخ الرجوع:</span>
            </div>
            <input
              required
              type="date"
              name="dateRetour"
              value={formData.dateRetour}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Objet */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Objet de la mission :</span>
              <span>الموضوع الكامل للمهمة:</span>
            </div>
            <input
              required
              name="objet"
              value={formData.objet}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Transport */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Moyens de transport :</span>
              <span>وسائل النقل:</span>
            </div>
            <input
              required
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Mission à */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Mission à :</span>
              <span>في أداء مهمته(ها):</span>
            </div>
            <input
              required
              name="missionA"
              value={formData.missionA}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Pièce d'identité */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Pièce d’identité :</span>
              <span>وثيقة الهوية:</span>
            </div>
            <input
              required
              name="identite"
              value={formData.identite}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Date & Lieu de délivrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-gray-400 font-medium mb-1">
                <span>Date de délivrance :</span>
                <span>تاريخ الإصدار:</span>
              </div>
              <input
                required
                type="date"
                name="dateDelivrance"
                value={formData.dateDelivrance}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-gray-400 font-medium mb-1">
                <span>Lieu de délivrance :</span>
                <span>مكان الإصدار:</span>
              </div>
              <input
                required
                name="lieuDelivrance"
                value={formData.lieuDelivrance}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Responsable */}
          <div>
            <div className="flex justify-between text-gray-400 font-medium mb-1">
              <span>Responsable émettant l’ordre :</span>
              <span>مسؤول المصلحة الذي أصدر الأمر بالمهمة:</span>
            </div>
            <input
              required
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Submit button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-[#0086CA] hover:bg-[#244e74] text-white font-semibold px-6 py-2 rounded-md"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdreMissionForm;
