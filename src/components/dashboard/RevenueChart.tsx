import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";

// Generate last 7 days data
const generateLast7DaysData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Format date as DD/MM
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDate = `${day}/${month}`;
    
    // Generate random revenue data with max under 500,000
    const revenue = Math.floor(Math.random() * 450000) + 50000;
    
    data.push({ date: formattedDate, revenue });
  }
  return data;
};

const data = generateLast7DaysData();

const RevenueChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        Doanh thu 7 ngày gần nhất
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#374151" />
          <YAxis tickFormatter={(value) => `${value/1000}k`} stroke="#374151" />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} 
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}
            itemStyle={{ color: '#374151' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4ade80" 
            strokeWidth={3} 
            dot={{ stroke: '#4ade80', strokeWidth: 2, r: 4 }} 
            activeDot={{ r: 6, stroke: '#4ade80' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;