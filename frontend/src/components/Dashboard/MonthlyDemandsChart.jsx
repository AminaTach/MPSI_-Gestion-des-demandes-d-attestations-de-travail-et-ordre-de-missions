// src/components/MonthlyDemandsChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyDemandsChart = () => {
  const data = [
    { name: 'Jan', OrdreDeMission: 40, AttestationDeTravail: 80 },
    { name: 'Feb', OrdreDeMission: 80, AttestationDeTravail: 60 },
    { name: 'Mar', OrdreDeMission: 60, AttestationDeTravail: 50 },
    { name: 'Apr', OrdreDeMission: 70, AttestationDeTravail: 70 },
    { name: 'May', OrdreDeMission: 50, AttestationDeTravail: 90 },
    { name: 'Jun', OrdreDeMission: 90, AttestationDeTravail: 100 },
  ];

  return (
    <div className=" rounded-2xl ">
      <h2 className="text-xl font-bold  text-start mb-4">Demandes traitées mensuellement</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="OrdreDeMission" fill="#36A2EB" radius={[10, 10, 0, 0]}  barSize={10} />
          <Bar dataKey="AttestationDeTravail" fill="#006384" radius={[10, 10, 0, 0]}  barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyDemandsChart;
