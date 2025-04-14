// src/components/Table.js
import React from 'react';

const Table = ({ title, data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="text-xl font-bold mb-4">{title}</div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">S/N</th>
            <th className="p-2">Demandeur</th>
            <th className="p-2">Date</th>
            <th className="p-2">Message</th>
            <th className="p-2">État</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="p-2">{item.sn}</td>
              <td className="p-2">{item.demandeur}</td>
              <td className="p-2">{item.date}</td>
              <td className="p-2">{item.message}</td>
              <td className="p-2">
                <span className={`text-${item.etat === 'Validée' ? 'green' : 'red'}-500`}>
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
