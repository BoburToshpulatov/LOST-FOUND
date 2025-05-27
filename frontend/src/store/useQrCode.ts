import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../lib/axiosInstance";

export type QRCodeType = {
  _id: string;
  isRegistered: boolean;
  isDisabled: boolean;
  owner?: any; // Replace with actual owner type if known
};

type Owner = {
  name: string;
  email: string;
  phone: string;
  backupPhone: string;
};

interface QrCodeState {
  qrCode: QRCodeType | null;
  loading: boolean;
  error: any;
  owner: Owner | null;

  fetchQRCode: (id: string) => Promise<void>;
  registerQRCode: (id: string) => Promise<void>;
}

export const useQrCode = create<QrCodeState>()(
  persist(
    (set) => ({
      qrCode: null,
      loading: false,
      error: null,
      owner: null,

      fetchQRCode: async (id) => {
        set({ loading: true, error: null, qrCode: null });
        try {
          const response = await axios.get(`${BASE_URL}/api/qr-code/${id}`);
          set({ qrCode: response.data.qrCode, owner: response.data.owner });
        } catch (err: any) {
          console.error("Error fetching QR code:", err);
          set({ error: err, qrCode: null });
        } finally {
          set({ loading: false });
        }
      },

      registerQRCode: async (id) => {
        set({ loading: true });
        try {
          const response = await axios.put(
            `${BASE_URL}/api/qr-code/${id}/register`
          );
          toast.success(response.data.message, { duration: 5000 });
        } catch (err: any) {
          console.error("Error registering QR code:", err);
          toast.error(err.response?.data?.message || "Registration failed");
          set({ error: err });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "qr-code-storage",
      partialize: (state) => ({ qrCode: state.qrCode, owner: state.owner }), // only persist qrCode
    }
  )
);
