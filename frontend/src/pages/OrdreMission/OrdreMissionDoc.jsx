import React, { useState } from "react";
import Header from "../../components/Topbar";

const OrdreMissionDoc = () => {
  const order = {
    id: "01",
    demandeur: "Laouar Boutheyna",
    date: "25/03/2025",
    message: "message,messagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessage",
    etat: "En attente",
  };

  const [formData, setFormData] = useState({
    missionNumber: "047",
    year: "2025",
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
  });

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
      <div className="grid grid-cols-1 bg-white max-w-6xl mx-4   gap-4 py-8 mt-4 px-4 md:px-8 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">
          Traitement de l’ordre de mission de:
        </h2>

        <div className="overflow-auto ">
          <table className=" w-full text-sm text-left">
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
                <td className="px-4 py-2 max-w-xs break-words whitespace-normal">
                  {order.message}
                </td>

                <td className={`px-4 py-2 ${getStatusColor(order.etat)}`}>
                  {order.etat}
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
          </div>

          <div className="flex items-center">
            <div className="flex-1">بأمر السيد(ة):</div>
          </div>

          <div className="flex items-center">
            <div>التابع(ة):</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
            <div>المنصب:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>بالذهاب في مهمة من:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
            <div>الى</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>الموضوع الكامل للمهمة:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>وسائل النقل:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>تاريخ الذهاب:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div>تاريخ الرجوع:</div>
            <div className="flex-1 mx-4">
              <input
                type="text"
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
          <div>المسلمة في:</div>
          <div>رقم:</div>
        </div>

        {/* Signature area */}
        <div className="text-center my-6" dir="rtl">
          <div>في:</div>
          <div>مسؤول المصلحة الذي أصدار الأمر بالمهمة</div>
        </div>

        {/* Additional sections */}
        <div className="mt-6" dir="rtl">
          <div className="border border-gray-400 w-full">
            <div className="border-b border-gray-400 p-2 text-center" dir="rtl">
              خانة مخصصة للتأشيرات(1)
            </div>

            {/* Arrival and departure dates */}
            <div className="grid grid-cols-2 border-b border-gray-400">
              <div className="col-span-1 border-r border-gray-400 p-2 text-center">
                تاريخ ووقت الخروج
              </div>
              <div className="col-span-1 p-2 text-center">
                تاريخ ووقت الوصول
              </div>
            </div>

            {/* Advance payment */}
            <div className="grid grid-cols-1 border-b border-gray-400">
              <div className="p-2 text-right" dir="rtl">
                تسبيق محصل عليه عند الذهاب - حصل على مبلغ:
                ........................
              </div>
            </div>

            {/* Account details */}
            <div className="grid grid-cols-4 border-b border-gray-400">
              <div className="col-span-1 p-2 text-right " dir="rtl">
                بعنوان تسبيق تبعا لكشف الحساب رقم:
              </div>
              <div className="col-span-1 p-2 text-center border-x border-gray-400">
                ...................................
              </div>
              <div className="col-span-1 p-2 text-center border-x border-gray-400">
                لهذا اليوم
              </div>

              <div className="col-span-1 p-2 text-center">
                ...................................
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-4 border-b border-gray-400">
              <div className="col-span-1 p-2 text-center border-x border-gray-400">
                ب:
              </div>
              <div className="col-span-1 p-2 text-center">
                ...................................
              </div>
              <div className="col-span-1 p-2 text-center border-x border-gray-400">
                في:
              </div>
              <div className="col-span-1 p-2 text-center">
                ...................................
              </div>
            </div>

            {/* Transportation implementation section */}
            <div className="grid grid-cols-1 border-b border-gray-400 p-2 text-center">
              تنفيذ التنقل
            </div>

            {/* Headers for travel details */}
            <div className="grid grid-cols-9 border-b border-gray-400">
              <div
                className="col-span-1 p-2 text-center border-r border-gray-400"
                dir="rtl"
              >
                الوجهات
              </div>
              <div className="col-span-8 p-2 text-center" dir="rtl">
                التواريخ - الساعات
              </div>
            </div>

            {/* Transportation table header */}
            <div className="grid grid-cols-9 border-b border-gray-400 items-center">
              <div
                className="col-span-1 p-2 text-center border-r border-gray-400"
                dir="rtl"
              >
                وسيلة النقل
              </div>

              {/* Return to site */}
              <div className="col-span-2 text-center border-r border-gray-400">
                <div className="p-1 border-b border-gray-400" dir="rtl">
                  الوصول الى الموقع
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-1 border-r border-gray-400" dir="rtl">
                    الساعة
                  </div>
                  <div className="p-1" dir="rtl">
                    التاريخ
                  </div>
                </div>
              </div>

              {/* Return to site */}
              <div className="col-span-2 text-center border-r border-gray-400">
                <div className="p-1 border-b border-gray-400" dir="rtl">
                  العودة الى الموقع
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-1 border-r border-gray-400" dir="rtl">
                    الساعة
                  </div>
                  <div className="p-1" dir="rtl">
                    التاريخ
                  </div>
                </div>
              </div>

              {/* Arrival to destination */}
              <div className="col-span-2 text-center border-r border-gray-400">
                <div className="p-1 border-b border-gray-400" dir="rtl">
                  الوصول الى الوجهة
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-1 border-r border-gray-400" dir="rtl">
                    الساعة
                  </div>
                  <div className="p-1" dir="rtl">
                    التاريخ
                  </div>
                </div>
              </div>

              {/* Departure from location */}
              <div className="col-span-2 text-center">
                <div className="p-1 border-b border-gray-400" dir="rtl">
                  الذهاب من الموقع
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-1 border-r border-gray-400" dir="rtl">
                    الساعة
                  </div>
                  <div className="p-1" dir="rtl">
                    التاريخ
                  </div>
                </div>
              </div>
            </div>

            {/* First journey row */}
            <div className="grid grid-cols-9 border-b border-gray-400">
              {/* Location details */}
              <div
                className="col-span-1 text-right border-t border-gray-400 p-2"
                dir="rtl"
              >
                من: الجزائر
                <br />
                إلى: جامعة الأغواط
              </div>

              {/* Empty cells for first journey */}
              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>
            </div>

            {/* Second journey row */}
            <div className="grid grid-cols-9 border-b border-gray-400">
              {/* Location details */}
              <div
                className="col-span-1 text-right border-t border-gray-400 p-2"
                dir="rtl"
              >
                من: .......
                <br />
                إلى: .......
              </div>

              {/* Empty cells for third journey */}
              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>
            </div>

            {/* Third journey row */}
            <div className="grid grid-cols-9 border-b border-gray-400">
              {/* Location details */}
              <div
                className="col-span-1 text-right border-t border-gray-400 p-2"
                dir="rtl"
              >
                من: .......
                <br />
                إلى: .......
              </div>

              {/* Empty cells for third journey */}
              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2 border-r border-gray-400">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r border-gray-400 p-2"></div>
                  <div className="p-2"></div>
                </div>
              </div>
            </div>

            {/* Total transportation time */}
            <div className="grid grid-cols-6 border-b border-gray-400">
              <div className="col-span-1 p-2 text-right" dir="rtl">
                مجموع مدة التنقل:
              </div>
              <div className="col-span-1 p-2 text-center border-r border-gray-400">
                .......................
              </div>

              <div
                className="col-span-1 p-2 text-center border-r border-gray-400"
                dir="rtl"
              >
                أيام:
              </div>

              <div className="col-span-1 p-2 text-center border-r border-gray-400">
                .......................
              </div>
              <div
                className="col-span-1 p-2 text-center border-r border-gray-400"
                dir="rtl"
              >
                ساعات:
              </div>

              <div className="col-span-1 p-2 text-center border-r border-gray-400">
                .......................
              </div>
            </div>

            {/* Accommodation nights */}
            <div className="grid grid-cols-2 border-b border-gray-400">
              <div
                className="col-span-1 p-2 text-right border-r border-gray-400"
                dir="rtl"
              >
                عدد الليالي في ضيافة المصلحة المستقبلة:
              </div>
              <div className="col-span-1 p-2 text-center">
                .......................................................................................
              </div>
            </div>
          </div>
        </div>

        {/* Verification section */}
        <div className="grid grid-cols-2 border border-gray-400 border-t-0 mt-0">
          <div className="p-4" dir="rtl">
            <div>يثبت (3) حقيقة الخدمة وصحة المعلومات المسجلة أعلاه</div>
            <div className="mt-4">
              حرر بـ ............... في: ..............................
            </div>
          </div>
          <div className="border-l border-gray-400 p-4" dir="rtl">
            <div>
              إن (3) السيد/السيدة: ................................. يشهد بصحة
              البيانات المسجلة أعلاه
            </div>
            <div className="mt-4">
              بـ ............................ في: ..............................
            </div>
            <div className="mt-4">الإمضاء</div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="mt-4 text-sm" dir="rtl">
          <div>(1) : الهيئة أو المصلحة المستقبلة.</div>
          <div>(2) : اسم و لقب المأمور بمهمة.</div>
          <div>(3) : رئيس المصلحة أو الهيئة المستقبلة.</div>
          <div>(تشطب البيانات غير المفيدة)</div>
        </div>

        {/* Footer with contact information */}
        <div className="mt-8 text-center text-sm">
          <div>
            ESI (Ecole nationale Supérieure d'Informatique) BP 68M, 16059, Oued
            Smar, Algérie
          </div>
          <div>Tél : 023.93.91.32 Fax : 023.93.91.34 ; http://www.esi.dz</div>
        </div>

        {/* Register button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-[#0086CA] hover:bg-[#244e74] text-white font-semibold px-24 py-2 rounded-3xl">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdreMissionDoc;
