// /api/payment
import api from "../../api/Api";

export interface PaymentDashboardData {
  date: string;
  revenue: number;
}

export const getPaymentDashboardLastDays = async (days: number) => {
  const res = await api.get("/api/payment/dashboard/last-days", { 
    params: { 
      days: days 
    } 
  });
  return res.data;
};