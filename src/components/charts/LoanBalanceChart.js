import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LoanBalanceChart = ({ amortizationSchedule }) => {
  // Process data for chart - take every 12th entry or fewer points for a cleaner chart
  const processChartData = () => {
    if (!amortizationSchedule || amortizationSchedule.length === 0) {
      return [];
    }

    const step = amortizationSchedule.length > 60 ? Math.floor(amortizationSchedule.length / 12) : 1;
    return amortizationSchedule
      .filter((_, index) => index % step === 0 || index === amortizationSchedule.length - 1)
      .map(entry => ({
        name: `${entry.month.substring(0, 3)} ${Math.floor(entry.count / 12)}`,
        balance: parseFloat(entry.remainingBalance),
      }));
  };

  const chartData = processChartData();

  return (
    <div className="card h-[300px] bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-primary mb-4">Balance Over Time</h2>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={Math.max(1, Math.floor(chartData.length / 6))}
            />
            <YAxis
              tickFormatter={(value) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, "Remaining Balance"]}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
            <Legend verticalAlign="top" align="right" />
            <Line
              type="monotone"
              dataKey="balance"
              name="Remaining Balance"
              stroke="#1A73E8"
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 6, stroke: '#1A73E8', strokeWidth: 1, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Generate an amortization schedule to view balance trends</p>
        </div>
      )}
    </div>
  );
};

export default LoanBalanceChart;