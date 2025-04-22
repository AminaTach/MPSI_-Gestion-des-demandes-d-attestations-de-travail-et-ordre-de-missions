// src/components/PieChart.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['orange','green',  'red'];

const RenderedPieChart = ({ data }) => {
  return (
    <PieChart width={300} height={300} className=' rounded-2xl'>
      <Pie
        data={data}
        cx={150}
        cy={150}
        innerRadius={60}
        outerRadius={120}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default RenderedPieChart;
