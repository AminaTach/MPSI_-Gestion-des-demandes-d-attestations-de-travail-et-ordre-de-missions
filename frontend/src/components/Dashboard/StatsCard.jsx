// src/components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, icon, percentage }) => {
  const textColorClass = percentage > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white shadow-md w-full flex-col font-nunito rounded-2xl px-8 py-6 flex items-start justify-between">
      <div className="text-xl w-full font-bold text-grey flex flex-row justify-between">
        {value}
        <div className="text-2xl bg-amber-100 rounded-full p-2 text-orange">{icon}</div>
      </div>
      <div className="text-grey text-base">{title}</div>
      <div className={`text-xs mt-4 ${textColorClass}`} style={{ color: percentage > 0 ? 'green !important' : 'red !important' }}>
        {percentage > 0 ? '↑' : '↓'} {Math.abs(percentage)}% par rapport au mois précédent
      </div>
    </div>
  );
};

export default StatsCard;
