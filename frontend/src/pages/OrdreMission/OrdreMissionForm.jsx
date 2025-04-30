// src/components/Dashboard.js
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
      <div class="h-2"></div>
      <div className="max-w-6xl mx-4  bg-white gap-4 py-8 mt-4 px-4 md:px-8 rounded-3xl shadow-md">
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

          {/* Submit button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-[#2D5F8B] hover:bg-[#244e74] text-white font-semibold px-6 py-2 rounded-md"
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
