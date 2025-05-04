import { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { CloudDownload, Save } from "lucide-react";
import { gapi } from "gapi-script";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewAttes() {
  const { id } = useParams(); // Get the attestation ID from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the attestation request details
  const [attestationRequest, setAttestationRequest] = useState({
    id: "",
    demandeur: "",
    date: "",
    message: "",
    etat: "",
  });

  // State for the certificate data
  const [certificateData, setCertificateData] = useState({
    title: "شـهـادة عـمـل",
    reference: "ن م م/م و ع إ آ/2025",
    date: new Date().toLocaleDateString("fr-DZ"),
    location: "وادي السمار",
    intro:
      "نحن الّموقع أدناه مدير المدرسة الوطنية العليا للإعلام الآلي بوادي السمار، نشهد بأن:",
    fullName: "",
    birthDate: "",
    rank: "",
    startDate: "",
    position: "",
    conclusion:
      "تــســلــّم هــــذه الــــشـــهـــادة لﻺســـتـــظـــهـــار بـــــها عـنـد اﻹقـتـضـاء.",
  });

  // Fetch attestation data when component mounts
  useEffect(() => {
    const fetchAttestationData = async () => {
      try {
        setIsLoading(true);
        
        // First get attestation details from the correct endpoint
        const attestResponse = await axios.get(`http://localhost:8000/api/attestations/${id}/details/`);
        
        if (attestResponse.data.success) {
          const attestData = attestResponse.data.demande;
          const userData = attestResponse.data.user;
          
          setAttestationRequest({
            id: attestData.id,
            demandeur: userData.username || 'Non spécifié',
            date: attestData.date,
            message: attestData.message,
            etat: attestData.etat,
          });
          
          // Update certificate data with user information
          setCertificateData(prevData => ({
            ...prevData,
            fullName: userData.nom_arabe + " " + userData.prenom_arabe,
            birthDate: userData.dateNais, // Format if needed
            rank: userData.Grade || "أستاذ مساعد قسم-أ", // Default if not available
            startDate: userData.Date1erEmbauche || "02-01-1982", // Default if not available
            position: userData.Stu_Adm || "أستاذ باحث", // Default if not available
            reference: `ن م م/م و ع إ آ/${new Date().getFullYear()}/${attestData.id}`
          }));
        } else {
          // If first endpoint fails, try the alternative endpoint
          const allAttestResponse = await axios.get(`http://localhost:8000/api/demande-attestation/all/`);
          
          if (allAttestResponse.data.success) {
            const allAttestations = allAttestResponse.data.attestations;
            const attestData = allAttestations.find(attest => attest.id_dem_attest == id);
            
            if (!attestData) {
              setError(`No attestation found with ID ${id}`);
              setIsLoading(false);
              return;
            }
            
            setAttestationRequest({
              id: attestData.id_dem_attest,
              demandeur: attestData.user__username || 'Non spécifié',
              date: attestData.Date,
              message: attestData.Message_dem_attest,
              etat: attestData.Etat,
            });
            
            // Try to get user details if we have user_id
            if (attestData.user_id) {
              try {
                const userResponse = await axios.get(`http://localhost:8000/api/users/${attestData.user_id}/`);
                
                if (userResponse.data.success) {
                  const userData = userResponse.data.user;
                  
                  // Update certificate data with user information
                  setCertificateData(prevData => ({
                    ...prevData,
                    fullName: userData.nom_arabe + " " + userData.prenom_arabe,
                    birthDate: userData.dateNais, // Format if needed
                    rank: userData.Grade || "أستاذ مساعد قسم-أ", // Default if not available
                    startDate: userData.Date1erEmbauche || "02-01-1982", // Default if not available
                    position: userData.Stu_Adm || "أستاذ باحث", // Default if not available
                    reference: `ن م م/م و ع إ آ/${new Date().getFullYear()}/${attestData.id_dem_attest}`
                  }));
                }
              } catch (userError) {
                console.error("Could not fetch user details:", userError);
                // Use default values if user fetch fails
                setCertificateData(prevData => ({
                  ...prevData,
                  fullName: attestData.user_name || "اسم المستخدم غير متوفر",
                  reference: `ن م م/م و ع إ آ/${new Date().getFullYear()}/${attestData.id_dem_attest}`
                }));
              }
            }
          } else {
            throw new Error("Failed to load attestation data");
          }
        }
      } catch (error) {
        console.error("Error fetching attestation data:", error);
        setError("An error occurred while fetching data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAttestationData();
    }
  }, [id]);

  const getStatusClass = (etat) => {
    const normalizedStatus = normalizeStatus(etat);
    
    switch (normalizedStatus) {
      case "en_attente":
        return "text-yellow-500";
      case "validee":
        return "text-green-500";
      case "rejetee":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  const normalizeStatus = (status) => {
    if (!status) return '';
    
    // Convert to lowercase and remove accents
    const normalized = status.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
      
    // Map to the exact values from the model
    if (normalized.includes('attente')) return 'en_attente';
    if (normalized.includes('valid')) return 'validee';
    if (normalized.includes('rejet')) return 'rejetee';
    
    return status; // Return original if no match
  };

  // Helper function to get a user-friendly display name for a status
  const getStatusDisplay = (etat) => {
    const normalizedStatus = normalizeStatus(etat);
    
    // Use the exact display values from the model's ETAT_CHOICES
    switch (normalizedStatus) {
      case "en_attente":
        return "En attente";
      case "validee":
        return "Validée";
      case "rejetee":
        return "Rejetée";
      default:
        return etat; // Return original if not matched
    }
  };

  const handleInputChange = (field, value) => {
    setCertificateData({
      ...certificateData,
      [field]: value,
    });
  };

  // Référence pour le contenu PDF
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `attestation-travail-${attestationRequest.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // Save changes to the server
  const handleSaveChanges = async () => {
    try {
      // Use the correct endpoint to update details
      const response = await axios.post(`http://localhost:8000/api/attestations/${id}/update-details/`, {
        certificate_data: certificateData
      });
      
      if (response.data.success) {
        alert("Changements enregistrés avec succès");
      } else {
        alert("Changements enregistrés localement. L'API a retourné une erreur.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Erreur lors de l'enregistrement des changements");
    }
  };

  // Generate official PDF from server
  const handleGeneratePDF = async () => {
    try {
      // Using the correct API endpoint for generating the work certificate
      window.open(`http://localhost:8000/api/attestations/${id}/generate/`, '_blank');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF");
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "964814800754-8lgiqlg6knvsd0prqghdvlntdofiac4j.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const createGoogleDoc = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      
      if (!authInstance) {
        alert("Google API n'est pas correctement initialisé. Veuillez rafraîchir la page et réessayer.");
        return;
      }
      
      const user = authInstance.currentUser.get();

      if (!user.isSignedIn()) {
        await authInstance.signIn();
      }

      const token = gapi.auth.getToken().access_token;

      if (!token) {
        alert("Impossible d'obtenir le jeton d'accès Google.");
        return;
      }

      const response = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Certificat de travail - ${attestationRequest.demandeur} - ${attestationRequest.id}`,
        }),
      });

      const data = await response.json();
      const docId = data.documentId;

      if (!docId) {
        alert("Erreur lors de la création du document. Veuillez réessayer.");
        return;
      }

      // Contenu à insérer dans le doc
      const text = ` 
${certificateData.location} في، ${certificateData.date}
المرجع: ${certificateData.reference}

${certificateData.title}

${certificateData.intro}

الإسم واللقب: ${certificateData.fullName}
تاريخ الميلاد: ${certificateData.birthDate}
الرتبة: ${certificateData.rank}
ينتمي إلى مؤسستنا منذ ${certificateData.startDate} إلى يومنا هذا.
الوظيفة: بصفته ${certificateData.position}.

${certificateData.conclusion}

امضاء و ختم المؤسسة
`;

      const requests = [
        {
          insertText: {
            location: { index: 1 },
            text,
          },
        },
        {
          updateTextStyle: {
            range: {
              startIndex: 1,
              endIndex: text.length + 1,
            },
            textStyle: {
              bold: false,
              fontSize: { magnitude: 14, unit: "PT" },
            },
            fields: "bold,fontSize",
          },
        },
      ];

      const boldTitles = [
        "الإسم واللقب:",
        "تاريخ الميلاد:",
        "الرتبة:",
        "الوظيفة:",
      ];

      boldTitles.forEach((label) => {
        const start = text.indexOf(label) + 1;
        const end = start + label.length;
        if (start > 0) {
          requests.push({
            updateTextStyle: {
              range: { startIndex: start, endIndex: end },
              textStyle: { bold: true },
              fields: "bold",
            },
          });
        }
      });

      // Envoyer les requêtes
      const updateResponse = await fetch(
        `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requests }),
        }
      );

      const updateData = await updateResponse.json();
      console.log("✅ Style appliqué", updateData);

      // Ouvrir le document
      window.open(`https://docs.google.com/document/d/${docId}/edit`, "_blank");
    } catch (error) {
      console.error("🚨 Erreur:", error);
      alert("Erreur lors de la création du document Google: " + error.message);
    }
  };

  // Update the status of the attestation using the correct endpoint
  const handleUpdateStatus = async (newStatus) => {
    try {
      // Use the normalized status to ensure we're always using the exact model values
      const normalizedStatus = normalizeStatus(newStatus);
      
      const response = await axios.post(`http://localhost:8000/api/attestations/${id}/update-status/`, {
        status: normalizedStatus
      });

      if (response.data.success) {
        // Update local state with normalized status
        setAttestationRequest({
          ...attestationRequest,
          etat: normalizedStatus
        });
        
        // Show status change message with user-friendly format
        alert(`Statut changé pour: ${getStatusDisplay(normalizedStatus)}`);
      } else {
        alert("Erreur lors de la mise à jour du statut: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut: " + error.message);
    }
  };

  return (
    <div
      className="bg-gray-50 min-h-screen p-4 overflow-y-auto"
      style={{ maxHeight: "100vh" }}
    >
      {/* Ordre de mission */}
      <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
        <h2 className="text-lg font-bold mb-4">
          Traitement de la demande d'attestation de:
        </h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">S/N</p>
              <p>{attestationRequest.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Demandeur</p>
              <p>{attestationRequest.demandeur}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p>{attestationRequest.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Message</p>
              <p>{attestationRequest.message}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">État</p>
              <div>
              <p className={getStatusClass(attestationRequest.etat)}>
                {getStatusDisplay(attestationRequest.etat)}
              </p>
            </div>
            </div>
          </div>
        </div>
        
        {/* Status update buttons */}
        <div className="flex justify-end gap-2 mb-4">
          
          {normalizeStatus(attestationRequest.etat) !== 'en_attente' && (
            <button 
              onClick={() => handleUpdateStatus('en_attente')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              En attente
            </button>
          )}
          {normalizeStatus(attestationRequest.etat) !== 'validee' && (
            <button 
            onClick={() => handleUpdateStatus('validee')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Valider
          </button>
          )}
          {normalizeStatus(attestationRequest.etat) !== 'rejetee' && (
            <button 
              onClick={() => handleUpdateStatus('rejetee')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Rejeter
            </button>
          )}
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-white shadow-sm rounded-lg mb-6 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Éditeur de certificat de travail</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Save className="h-5 w-5" />
            <span>Enregistrer</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-[#0086CA] text-white rounded-lg hover:bg-blue-600"
          >
            <CloudDownload className="h-5 w-5" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>
      <div className="w-full flex justify-between mb-4">
        <button
          onClick={handleGeneratePDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <CloudDownload className="h-5 w-5" />
          <span>Générer PDF officiel</span>
        </button>
        <div className="text-blue-500 flex items-center">
          <button
            onClick={createGoogleDoc}
            className="text-blue-500 flex items-center"
          >
            <CloudDownload className="h-5 w-5 mr-2" color="#0086CA" />
            <span className="underline text-[#0086CA]">
              Ouvrir dans Google Docs
            </span>
          </button>
        </div>
      </div>

      {/* Document PDF */}
      <div
        ref={pdfRef}
        className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto p-8"
      >
        {/* En-tête */}
        <div className="flex justify-between mb-8">
          <div className="text-right" dir="rtl">
            <h2 className="text-xl font-bold">نيابة مديرية المستخدمين</h2>
            <p className="text-lg">SOUS DIRECTION DES PERSONNELS</p>
          </div>
        </div>

        {/* Référence et date */}
        <div className="flex justify-between mb-12">
          <div className="text-right" dir="rtl">
            <p>
              {certificateData.location} في، {certificateData.date}
            </p>
          </div>
          <div className="text-right" dir="rtl">
            <p>المرجع: {certificateData.reference}</p>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl font-bold border-b-2 border-black inline-block px-8 py-2"
            dir="rtl"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInputChange("title", e.target.innerText)}
          >
            {certificateData.title}
          </h1>
        </div>

        {/* Contenu */}
        <div className="text-justify leading-8" dir="rtl">
          <p>{certificateData.intro}</p>

          <div className="my-4">
            <p className="font-bold">الإسم واللقب:</p>
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInputChange("fullName", e.target.innerText)}
            >
              {certificateData.fullName}
            </p>
          </div>

          <div className="my-4">
            <p className="font-bold">تاريخ الميلاد:</p>
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInputChange("birthDate", e.target.innerText)}
            >
              {certificateData.birthDate}
            </p>
          </div>

          <div className="my-4">
            <p className="font-bold">الرتبة:</p>
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInputChange("rank", e.target.innerText)}
            >
              {certificateData.rank}
            </p>
          </div>

          <div className="my-4">
            <p className="font-bold">الوظيفة:</p>
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInputChange("position", e.target.innerText)}
            >
              {certificateData.position}
            </p>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mt-12 mb-8 text-right" dir="rtl">
          <p>{certificateData.conclusion}</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p>امضاء و ختم المؤسسة</p>
        </div>
      </div>
    </div>
  );
}