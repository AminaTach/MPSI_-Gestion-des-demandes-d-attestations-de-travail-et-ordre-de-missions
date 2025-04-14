// src/Sidebar.js
import {React,useState} from 'react';
import Esi from '../images/esi-logo.svg'
import Depot from '../images/sidebar/deposer.svg'
import Suivi from '../images/sidebar/suivi.svg'
import Telecharger from '../images/sidebar/telecharget.svg'
import logout from '../images/sidebar/logout.svg'
import doc from '../images/sidebar/doc.svg'
import ordre from '../images/sidebar/ordere.svg'
import dash from '../images/sidebar/dashboard.svg'
import swich from '../images/sidebar/switch.svg'
import attes from '../images/sidebar/attestation.svg'


const Sidebar = ({ role }) => {
  return (
    <div className=" hidden sm:flex flex-col  w-[1/3] bg-blue_nav text-white p-4">
      <div className="flex w-[1/3] justify-center mb-6">
        <img src={Esi} alt="Logo" className="w-24 h-auto" />
      </div>
      <div className="flex-grow  w-[1/3] text-xs ">
        {role === 'employee' && (
          <ul className="space-y-2 font-nunito text-start   ">
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={Depot}/>Déposer une demande</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={Suivi}/>Suivi des demandes</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={Telecharger}/>Télécharger mes documents</li>
          </ul>
        )}
        {role === 'rh' && (
          <ul className="space-y-2">
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected  flex flex-row gap-2 cursor-pointer"><img src={dash}/>Dashboard</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={ordre}/>Ordre de mission</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={attes}/>Attestation de travail</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={doc}/>Mes Documents</li>
            <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={swich}/>Switcher en tant que demandeur</li>
          </ul>
        )}
      </div>
      <div className="mt-auto text-xs ">
        <ul className="space-y-2">
          <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={Depot}/>Profil</li>
          <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={Depot}/>Paramètres</li>
          <li className="px-1 py-2 rounded-lg hover:bg-bleu_selected flex flex-row gap-2 cursor-pointer"><img src={logout}/>Déconnexion</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
