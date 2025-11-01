import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getPaymentDashboardLastDays } from "../../services/payments";
import { useToast } from "../common/ToastContext";
import type { PaymentDashboardData } from "../../services/payments";

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState<number>(7);
  const [data, setData] = useState<PaymentDashboardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await getPaymentDashboardLastDays(timeRange);
        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        addToast("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.", "error");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [timeRange, addToast]);

  const timeRangeOptions = [
    { value: 7, label: "7 ngày" },
    { value: 30, label: "30 ngày" },
    { value: 90, label: "90 ngày" }
  ];

  // Format the date for display (from YYYY-MM-DD to DD/MM)
  const formatDate = (dateString: string) => {
    // Split the date string (YYYY-MM-DD) and reformat to DD/MM
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`; // DD/MM
    }
    // Fallback to original if format is unexpected
    return dateString;
  };

  // Format data for the chart
  const chartData = useMemo(() => {
    if (loading) return [];
    return data.map(item => ({
      date: formatDate(item.date),
      revenue: item.revenue
    }));
  }, [data, loading]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-md h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FD957]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Doanh thu
        </h2>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === option.value
                  ? "bg-green-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        {timeRange} ngày gần nhất
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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