import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { CloudDownload, Save } from "lucide-react";
import { gapi } from "gapi-script";
import { useEffect } from "react";

export default function WorkCertificateEditor() {
  const [missionOrders, setMissionOrders] = useState([
    {
      id: "01",
      demandeur: "Laouar Boutheyna",
      date: "25/03/2025",
      message: "Pour un prêt bancaire",
      etat: "En attente",
    },
  ]);

  const [certificateData, setCertificateData] = useState({
    title: "شـهـادة عـمـل",
    reference: "ن م م/م و ع إ آ/2025",
    date: new Date().toLocaleDateString("fr-DZ"), // 👈 Date d’aujourd’hui
    location: "وادي السمار",
    intro:
      "نحن الّموقع أدناه مدير المدرسة الوطنية العليا للإعلام الآلي بوادي السمار، نشهد بأن:",
    fullName: "دحماني فوضيل",
    birthDate: "19-07-1957",
    rank: "أستاذ مساعد قسم-أ",
    startDate: "02-01-1982",
    position: "أستاذ باحث",
    conclusion:
      "تــســلــّم هــــذه الــــشـــهـــادة لﻺســـتـــظـــهـــار بـــــها عـنـد اﻹقـتـضـاء.",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const getStatusClass = (etat) => {
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

  const filteredMissionOrders = missionOrders.filter(
    (order) =>
      order.demandeur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.date.includes(searchQuery)
  );

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
      filename: "attestation-travail.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "964814800754-8lgiqlg6knvsd0prqghdvlntdofiac4j.apps.googleusercontent.com", // remplace ici
        scope:
          "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const createGoogleDoc = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();

      if (!user.isSignedIn()) {
        await authInstance.signIn();
      }

      const token = gapi.auth.getToken().access_token;

      const response = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Certificat de travail",
        }),
      });

      const data = await response.json();
      const docId = data.documentId;

      // Contenu basique à insérer dans le doc
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

      console.log("📤 Requêtes préparées:", requests.length);

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
          Traitement de l'ordre de mission de:
        </h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">S/N</p>
              <p>{filteredMissionOrders[0].id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Demandeur</p>
              <p>{filteredMissionOrders[0].demandeur}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p>{filteredMissionOrders[0].date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Message</p>
              <p>{filteredMissionOrders[0].message}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">État</p>
              <p className={getStatusClass(filteredMissionOrders[0].etat)}>
                {filteredMissionOrders[0].etat}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-white shadow-sm rounded-lg mb-6 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Éditeur de certificat de travail</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Save className="h-5 w-5" />
            <span>Enregistrer</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-[#0086CA] text-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <CloudDownload className="h-5 w-5" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end mb-4">
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
