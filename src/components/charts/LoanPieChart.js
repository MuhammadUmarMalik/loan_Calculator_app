import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LoanPieChart = ({ loanAmount, totalInterest }) => {
  // Ensure we have valid numbers for the chart
  const principalValue = parseFloat(loanAmount) || 0;
  const interestValue = parseFloat(totalInterest) || 0;
  
  const data = [
    { name: 'Principal', value: principalValue },
    { name: 'Interest', value: interestValue },
  ];

  const COLORS = ['#1A73E8', '#EF4444'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Check if we have data to display (both principal and interest)
  const hasValidData = principalValue > 0 || interestValue > 0;
  
  return (
    <div className="card h-[300px] bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-primary mb-4">Payment Breakdown</h2>
      
      {hasValidData ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Enter loan details and calculate to view breakdown</p>
        </div>
      )}
    </div>
  );
};

export default LoanPieChart;