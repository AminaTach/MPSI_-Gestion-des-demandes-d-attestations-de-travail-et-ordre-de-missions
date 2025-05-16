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
          {data.map((order, index) => (
            <tr key={order.id_dem_ordre} className="bg-white text-text border-b-gray-100 border-b">
              <td className="hidden xs:flex p-2">{order.id_dem_ordre}  {order.id_dem_attest}</td>
              <td className="p-2">{order.user__username}</td>
              <td className="p-2">{order.Date}</td>
              <td className="p-2"> {order.Message_ordre}</td>
              <td className="p-2">
                <span className={order.Etat== 'validee' ? 'text-green' : (order.Etat === 'en_attente' ? 'text-orange' : 'text-red-500')}>
                  {order.Etat}
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
