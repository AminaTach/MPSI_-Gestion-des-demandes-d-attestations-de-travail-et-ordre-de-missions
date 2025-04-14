// src/components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, icon, percentage }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-gray-600">{title}</div>
        <div className={`text-${percentage > 0 ? 'green' : 'red'}-500`}>
          {percentage > 0 ? '↑' : '↓'} {Math.abs(percentage)}% par rapport au mois précédent
        </div>
      </div>
      <div className="text-4xl text-gray-400">{icon}</div>
    </div>
  );
};

export default StatsCard;
