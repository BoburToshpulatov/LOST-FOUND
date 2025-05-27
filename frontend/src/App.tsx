import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";

import QRPage from "./pages/QRPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OwnerPage from "./pages/OwnerPage";
import FinderPage from "./pages/FinderPage";
import { useEffect } from "react";
import { useAuthStore } from "./store/useProfile";
import { useQrCode } from "./store/useQrCode";

function App() {
  const { theme } = useThemeStore();
  const { fetchProfile, user, checkAuth } = useAuthStore();
  const { qrCode } = useQrCode();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (checkAuth) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-base-200 transition-all duration-300 relative overflow-hidden"
        data-theme={theme}
      >
        <div className="relative">
          <div className="w-20 h-20 border-primary/10 border-2 rounded-full">
            <div className="w-20 h-20 border-primary border-t-2 animate-spin rounded-full absolute left-0 top-0" />
            <div className="sr-only">Loading</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300 relative overflow-hidden"
      data-theme={theme}
    >
      <div className="relative pt-20 z-50">
        <Navbar />

        <Routes>
          <Route path="/qr/:id" element={<QRPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login/:id"
            element={!user ? <Login /> : <Navigate to="/owner" />}
          />
          <Route
            path="/sign-up/:id"
            element={!user ? <SignUp /> : <Navigate to="/owner" />}
          />
          <Route
            path="/owner"
            element={
              user ? <OwnerPage /> : <Navigate to={`/login/${qrCode?._id}`} />
            }
          />
          <Route path="/finder/:id" element={<FinderPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
