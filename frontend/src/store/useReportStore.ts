import { create } from "zustand";
import axios from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

interface QRCode {
  _id: string;
  isRegistered: boolean;
  isDisabled: boolean;
  deposit: number;
}

interface Report {
  _id: string;
  finderName: string;
  finderPhone: string;
  email?: string;
  locationLink: string;
  confirmedByOwner: boolean;
  rewardClaimed: boolean;
  qrId: QRCode; // Now a full object
}

interface Reward {
  code: string;
  amount: number;
  finderPhone: string;
  finderEmail?: string;
}

interface ReportStore {
  loading: boolean;
  error: string | null;
  reports: Report[];
  selectedReport: Report | null;
  reward: Reward | null;

  submitReport: (qrId: string, data: any) => Promise<boolean>;
  getReport: (reportId: string) => Promise<void>;
  confirmReport: (reportId: string) => Promise<void>;
  fetchUnconfirmedReports: () => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
  loading: false,
  error: null,
  reports: [],
  selectedReport: null,
  reward: null,

  submitReport: async (qrId, data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`/api/reports/${qrId}`, data);
      set((state) => ({
        reports: [res.data.report, ...state.reports],
        loading: false,
      }));
      toast.success(res.data.message, { duration: 5000 });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error submitting report",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Report submission failed");
      return false;
    }
  },

  getReport: async (reportId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/api/reports/${reportId}`);
      set({ selectedReport: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error fetching report",
        loading: false,
      });
    }
  },

  confirmReport: async (reportId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`/api/reports/${reportId}/confirm`);
      set({
        reward: res.data.reward,
        loading: false,
      });
      toast.success(res.data.message, { duration: 5000 });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error confirming report",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Report confirmation failed");
    }
  },

  fetchUnconfirmedReports: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/api/reports/all-reports`);
      set({ reports: res.data.reports, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error loading reports",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Report loading failed");
    }
  },
}));
