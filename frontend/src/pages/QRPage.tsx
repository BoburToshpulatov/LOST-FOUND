import { useEffect, useState } from "react";
import { useQrCode } from "../store/useQrCode";
import { Navigate, useParams } from "react-router-dom";
import { AlertCircle, Ban } from "lucide-react";

const QRPage = () => {
  const { qrCode, loading, fetchQRCode } = useQrCode();
  const { id } = useParams();

  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQRCode(id);
    }
  }, [id, fetchQRCode]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowUI(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading || !showUI) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-200 text-center px-4 overflow-hidden">
        <div className="text-4xl font-bold text-primary mb-4 animate-fade-in">
          Welcome to Lost and Found 👋
        </div>
        <div className="text-lg text-base-content mb-6 max-w-md">
          We're getting things ready for you. Please hold on while we load your
          QR code info.
        </div>
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-200 text-center px-4">
        <AlertCircle className="w-16 h-16 text-error mb-4 animate-fade-in" />

        <div className="text-3xl font-semibold text-error mb-2">
          QR Code Not Found
        </div>

        <div className="text-base text-base-content max-w-md mb-4">
          We couldn’t find anything linked to this QR code. It may be broken,
          unregistered, or invalid.
        </div>
      </div>
    );
  }

  if (qrCode?.isDisabled) {
    console.log(qrCode.isDisabled);
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-200 text-center px-4">
        <Ban className="w-16 h-16 text-warning mb-4 animate-fade-in" />

        <div className="text-3xl font-semibold text-warning mb-2">
          QR Code Expired or Disabled
        </div>

        <div className="text-base text-base-content max-w-md mb-4">
          This QR code has been disabled — most likely due to an expired deposit
          or manual deactivation.
        </div>
      </div>
    );
  }

  return qrCode?.isRegistered ? (
    <Navigate to={`/finder/${qrCode._id}`} replace />
  ) : (
    <Navigate to={`/sign-up/${qrCode?._id}`} replace />
  );
};

export default QRPage;
