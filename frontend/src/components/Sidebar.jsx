import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

import Esi from '../images/esi-logo.svg';
import Esi2 from '../images/ESI-LOGO-black.svg';
import Depot from '../images/sidebar/deposer.svg';
import Suivi from '../images/sidebar/suivi.svg';
import Telecharger from '../images/sidebar/telecharget.svg';
import logout from '../images/sidebar/logout.svg';
import doc from '../images/sidebar/doc.svg';
import ordre from '../images/sidebar/ordere.svg';
import dash from '../images/sidebar/dashboard.svg';
import swich from '../images/sidebar/switch.svg';
import attes from '../images/sidebar/attestation.svg';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    employee: [
      { label: 'Déposer une demande', icon: Depot, path: '/employee/demande' },
      { label: 'Suivi des demandes', icon: Suivi, path: '/employee/suivi' },
      { label: 'Télécharger mes documents', icon: Telecharger, path: '/employee/docs' },
    ],
    rh: [
      { label: 'Dashboard', icon: dash, path: '/rh/dashboard' },
      { label: 'Ordre de mission', icon: ordre, path: '/rh/ordre' },
      { label: 'Attestation de travail', icon: attes, path: '/rh/attestation' },
      { label: 'Mes Documents', icon: doc, path: '/rh/docs' },
      { label: 'Switcher en tant que demandeur', icon: swich, path: '/employee' },
    ],
  };

  const footerItems = [
    { label: 'Profil', icon: Depot, path: '/profil' },
    { label: 'Paramètres', icon: Depot, path: '/parametres' },
    { label: 'Déconnexion', icon: logout, path: '/logout' },
  ];

  const getItemClass = (path) => {
    const isActive = location.pathname === path;
    return `px-2 py-2 rounded-lg flex flex-row gap-2 cursor-pointer ${
      isActive ? 'bg-bleu_selected' : 'hover:bg-bleu_selected hover:bg-opacity-50'

    }`;
  };

  const renderMenu = (isMobile = false, section = 'main') => {
    const itemsToRender = section === 'main' ? menuItems[role] || [] : footerItems;

    return (
      <div className={`flex flex-col ${isMobile ? 'text-violet' : 'text-white'} space-y-2 text-lg text-center sm:text-start font-bold sm:text-sm  font-nunito`}>
        {itemsToRender.map((item) => (
          <li
            key={item.label}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setIsOpen(false);
            }}
            className={getItemClass(item.path)}
          >
            {!isMobile &&
            <img src={item.icon} alt="" />}
            {item.label}
          </li>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar for screens >= sm */}
      <div className="hidden sm:flex flex-col min-h-screen  w-64 bg-blue_nav text-white p-4">
        <div className="flex justify-center mb-6">
          <img src={Esi} alt="Logo" className="w-24 h-auto" />
        </div>
        <div className="flex flex-col justify-between h-full text-xs sm:text-sm">
          <ul className="space-y-2">{renderMenu(false, 'main')}</ul>
          <ul className="space-y-2">{renderMenu(false, 'footer')}</ul>
        </div>
      </div>

      {/* Mobile button */}
      <div className="sm:hidden fixed top-5 right-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-blue-900 text-3xl focus:outline-none">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-white z-40 p-4 flex flex-col">
          <div className="flex justify-center mb-6">
            <img src={Esi2} alt="Logo" className="w-24 h-auto" />
          </div>
          <div className="flex flex-col justify-between  items-center h-full text-xs">
            <ul className="space-y-4">{renderMenu(true, 'main')}</ul>
            <ul className="space-y-4">{renderMenu(true, 'footer')}</ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
