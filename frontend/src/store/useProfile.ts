// stores/useAuthStore.ts
import { create } from "zustand";
import axios from "../lib/axiosInstance";
import toast from "react-hot-toast";

type AuthFormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  backupPhone: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  backupPhone: string;
  verified: boolean;
};

type AuthState = {
  formData: AuthFormData;
  verificationCode: string;
  loginCode: string;
  user: User | null;
  qrCodes: any[];
  checkAuth: boolean;
  loading: boolean;
  error: null | string | { status: number };
};

type AuthActions = {
  setFormData: (data: Partial<AuthFormData>) => void;
  setVerificationCode: (code: string) => void;
  setLoginCode: (code: string) => void;
  resetForm: () => void;
  submitSignUp: () => Promise<boolean>;
  verifyEmailCode: () => Promise<boolean>;
  resendVerificationCode: () => Promise<void>;
  login: () => Promise<{ success: boolean; status?: number }>;

  verifyLoginCode: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  formData: {
    name: "",
    email: "",
    password: "",
    phone: "",
    backupPhone: "",
  },
  verificationCode: "",
  loginCode: "",
  user: null,
  qrCodes: [],
  loading: false,
  error: null,
  checkAuth: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setVerificationCode: (code) => set({ verificationCode: code }),
  setLoginCode: (code) => set({ loginCode: code }),

  resetForm: () =>
    set({
      formData: {
        name: "",
        email: "",
        password: "",
        phone: "",
        backupPhone: "",
      },
      verificationCode: "",
      loginCode: "",
      error: null,
    }),

  submitSignUp: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/register", get().formData);
      toast.success(res.data.message, { duration: 5000 });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  verifyEmailCode: async () => {
    set({ loading: true, error: null });
    try {
      const { verificationCode, formData } = get();
      const res = await axios.post("/api/auth/verify-email", {
        email: formData.email,
        code: verificationCode,
      });
      localStorage.setItem("token", res.data.token);
      await get().fetchProfile();
      toast.success(res.data.message, { duration: 5000 });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || "Verification failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationCode: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/resend-code", {
        email: get().formData.email,
      });
      toast.success(res.data.message, { duration: 5000 });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },

  login: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/login", {
        email: get().formData.email,
        password: get().formData.password,
      });
      toast.success(res.data.message, { duration: 5000 });
      return { success: true };
    } catch (err: any) {
      const status = err.response?.status;
      set({ error: { status } });
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, status };
    } finally {
      set({ loading: false });
    }
  },

  verifyLoginCode: async () => {
    set({ loading: true, error: null });
    try {
      const { formData, verificationCode } = get();
      const res = await axios.post("/api/auth/verify-login", {
        email: formData.email,
        code: verificationCode,
      });
      localStorage.setItem("token", res.data.token);
      await get().fetchProfile();
      toast.success(res.data.message, { duration: 5000 });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || "Login verification failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    set({ checkAuth: true, error: null });
    try {
      const res = await axios.get("/api/auth/profile");
      set({
        user: res.data.user,
        qrCodes: res.data.qrCodes,
        checkAuth: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        checkAuth: false,
        user: null,
      });
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put("/api/auth/update", updates);
      set({ user: res.data.user });
      toast.success(res.data.message, { duration: 5000 });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      formData: {
        name: "",
        email: "",
        password: "",
        phone: "",
        backupPhone: "",
      },
    });
  },
}));
