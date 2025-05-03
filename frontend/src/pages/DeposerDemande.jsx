import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Topbar';

const DeposerDemande = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const [missionForm, setMissionForm] = useState({
    nom_employe: '',
    departement: '',
    poste: '',
    date_debut_mission: '',
    date_fin_mission: '',
    Message_ordre: '',
    piece_identite: null
  });

  const [selectedFileName, setSelectedFileName] = useState('');
  const [certificateMessage, setCertificateMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email) {
      setUserEmail(userData.email);
    }
  }, []);

  const handleMissionFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'piece_identite' && files) {
      setMissionForm({
        ...missionForm,
        [name]: files[0]
      });
      setSelectedFileName(files[0].name);
    } else {
      setMissionForm({
        ...missionForm,
        [name]: value
      });
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleMissionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('user_id', userEmail);
      Object.keys(missionForm).forEach(key => {
        formData.append(key, missionForm[key]);
      });

      const response = await axios.post('http://localhost:8000/api/demande-ordre-mission/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccess(true);
      setMissionForm({
        nom_employe: '',
        departement: '',
        poste: '',
        date_debut_mission: '',
        date_fin_mission: '',
        Message_ordre: '',
        piece_identite: null
      });
      setSelectedFileName('');

      setTimeout(() => {
        setShowSuccess(false);
        setActiveSection('main');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'ordre de mission:', error);
      setErrorMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('/api/demande-attestation/create/', {
        user_id: userEmail,
        message: certificateMessage
      });

      setShowModal(false);
      setShowSuccess(true);
      setCertificateMessage('');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'attestation:', error);
      setErrorMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCertificateModal = () => {
    setModalType('certificate');
    setShowModal(true);
  };

  if (activeSection === 'main') {
    return (
      <div className="w-full pb-4 font-nunito sm:w-[3/4]">
        <Header />
        <div className="bg-blue-50 p-4 md:p-8 min-h-screen w-full">
          <h2 className="text-2xl font-semibold text-[#0086CA] mb-8">Déposer une demande</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center">
              <div className="text-[#0086CA] mb-4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0086CA] mb-2">Ordre de mission</h3>
              <p className="text-gray-600 text-center mb-8">
                Besoin d'un ordre de mission ? Cliquez sur le bouton ci-dessous pour envoyer votre demande. Une fois validée, vous pourrez la télécharger directement.
              </p>
              <button
                onClick={() => setActiveSection('mission')}
                className="bg-[#0086CA] hover:bg-cyan-600 text-white px-8 py-2 rounded-md font-medium w-full"
              >
                Demander
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center">
              <div className="text-[#0086CA] mb-4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0086CA] mb-2">Attestation de travail</h3>
              <p className="text-gray-600 text-center mb-8">
                Besoin d'une attestation de travail ? Cliquez sur le bouton ci-dessous pour envoyer votre demande. Une fois validée, vous pourrez la télécharger directement.
              </p>
              <button
                onClick={openCertificateModal}
                className="bg-[#0086CA] hover:bg-cyan-700 text-white px-8 py-2 rounded-md font-medium w-full"
              >
                Demander
              </button>
            </div>
          </div>
          {showModal && modalType === 'certificate' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <button onClick={() => setShowModal(false)} className="text-gray-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-bold text-[#0086CA] mb-4">
                  Vous êtes sur le point d'envoyer une demande d'attestation de travail.
                </h3>
                <p className="mb-4">Souhaitez-vous ajouter un message avant de valider ?</p>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  rows="4"
                  placeholder="Message (optionnel)"
                  value={certificateMessage}
                  onChange={(e) => setCertificateMessage(e.target.value)}
                />
                {errorMessage && (
                  <p className="!text-red-600 mb-4 !important">{errorMessage}</p>
                )}
                <button
                  onClick={handleCertificateSubmit}
                  disabled={isLoading}
                  className="bg-[#0086CA] hover:bg-cyan-600 text-white px-6 py-3 rounded-md font-medium w-full disabled:bg-cyan-300"
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </div>
            </div>
          )}
          {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
                <div className="text-cyan-500 mb-4 flex justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Demande Envoyée</h3>
                <p className="mb-4">Votre demande a été envoyée avec succès.</p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-[#0086CA] hover:bg-cyan-600 text-white px-6 py-2 rounded-md font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSection === 'mission') {
    return (
      <div className="bg-blue-50 p-4 md:p-8 min-h-screen w-full">
        <button
          onClick={() => setActiveSection('main')}
          className="mb-6 flex items-center text-[#0086CA]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Retour</span>
        </button>
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-[#0086CA] mb-8">
            Ordre de mission <span className="text-gray-400 font-light">/ أمر بمهمة</span>
          </h2>
          {errorMessage && (
            <div className="!bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 !important">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleMissionSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-gray-700">
                Le(la) nommé(e):
              </div>
              <div className="text-gray-700 text-right">
                السيد(ة):
              </div>
            </div>
            <input
              type="text"
              name="nom_employe"
              value={missionForm.nom_employe}
              onChange={handleMissionFormChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-700">
                    Département:
                  </div>
                  <div className="text-gray-700">
                    التابع(ة):
                  </div>
                </div>
                <input
                  type="text"
                  name="departement"
                  value={missionForm.departement}
                  onChange={handleMissionFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-700">
                    Poste:
                  </div>
                  <div className="text-gray-700">
                    المنصب:
                  </div>
                </div>
                <input
                  type="text"
                  name="poste"
                  value={missionForm.poste}
                  onChange={handleMissionFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="text-gray-700 flex justify-between items-center">
              <span>Est chargé(e) d'effectuer une mission du au:</span>
              <span>بالذهاب في مهمة من إلى:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="date"
                  name="date_debut_mission"
                  value={missionForm.date_debut_mission}
                  onChange={handleMissionFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="[date de début]"
                  required
                />
              </div>
              <div>
                <input
                  type="date"
                  name="date_fin_mission"
                  value={missionForm.date_fin_mission}
                  onChange={handleMissionFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="[date de fin]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-700">
                Objet de la mission:
              </div>
              <div className="text-gray-700 text-right">
                الموضوع الكامل للمهمة:
              </div>
            </div>
            <textarea
              name="Message_ordre"
              value={missionForm.Message_ordre}
              onChange={handleMissionFormChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              required
            />
            <div className="flex justify-between items-center">
              <div className="text-gray-700">
                Pièce d'identité:
              </div>
              <div className="text-gray-700 text-right">
                وثيقة الهوية:
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="piece_identite"
              onChange={handleMissionFormChange}
              className="hidden"
            />
            <div className="border border-gray-300 rounded-md p-3 flex items-center justify-between cursor-pointer bg-white" onClick={handleFileButtonClick}>
              <div className="text-gray-500 overflow-hidden text-ellipsis">
                {selectedFileName || 'Aucun fichier sélectionné'}
              </div>
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-4 rounded-md text-sm border border-gray-300"
              >
                Parcourir...
              </button>
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#0086CA] hover:bg-cyan-600 text-white px-12 py-3 rounded-md font-medium disabled:bg-cyan-300"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
              <div className="text-cyan-500 mb-4 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Demande Envoyée</h3>
              <p className="mb-4">Votre demande a été envoyée avec succès.</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-[#0086CA] hover:bg-cyan-600 text-white px-6 py-2 rounded-md font-medium"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default DeposerDemande;
