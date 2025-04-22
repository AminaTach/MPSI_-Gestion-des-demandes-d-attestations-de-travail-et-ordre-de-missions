// src/components/Table.js
import React from 'react';

const Table = ({ title, data }) => {
  return (
    <div className="bg-white shadow-md text-sm font-nunito rounded-2xl p-4">
      <div className="text-xl font-bold mb-4">{title}</div>
      <table className="w-full">
        <thead>
          <tr className="bg-white border-b-gray-100  border-b">
            <th className="hidden  xs:flex p-2">S/N</th>
            <th className="p-2">Demandeur</th>
            <th className="p-2">Date</th>
            <th className="p-2">Message</th>
            <th className="p-2">État</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-white text-text border-b-gray-100 border-b">
              <td className="hidden xs:flex p-2">{item.sn}</td>
              <td className="p-2">{item.demandeur}</td>
              <td className="p-2">{item.date}</td>
              <td className="p-2">{item.message}</td>
              <td className="p-2">
                <span className={item.etat === 'Validée' ? 'text-green' : (item.etat === 'En attente' ? 'text-orange' : 'text-red')}>
                  {item.etat}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
