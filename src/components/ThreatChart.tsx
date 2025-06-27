
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ThreatData {
  name: string;
  value: number;
  color: string;
}

interface ThreatChartProps {
  data: ThreatData[];
}

export const ThreatChart: React.FC<ThreatChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">
            Count: <span className="font-mono">{data.value}</span>
          </p>
          <p className="text-gray-300">
            Percentage: <span className="font-mono">{((data.value / data.payload.total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap justify-center mt-4 space-x-4">
        {payload.map((entry: any, index: number) => (
          <li key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Add total to each data point for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
