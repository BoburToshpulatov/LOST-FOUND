import { motion } from "framer-motion";
import { useAuthStore } from "../store/useProfile";
import { QrCodeIcon } from "lucide-react";

type QRCode = {
  isRegistered: boolean;
  isDisabled: boolean;
  owner?: any;
  deposit: number;
  _id: string;
};

const QRList = () => {
  const { qrCodes, user } = useAuthStore();

  if (!qrCodes.length) {
    // Show this if there are no reports
    return (
      <motion.div
        className="max-w-5xl mx-auto text-center py-20 text-base-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xl">No QR Codes found.</p>
        <p className="mt-2">
          You haven't added any QR Codes yet. Start by registering a QR code to
          track lost items and rewards!
        </p>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  mx-auto sm:justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {qrCodes.map((qrCode: QRCode) => (
        <motion.div
          key={qrCode._id}
          className="bg-base-content/10 shadow-lg rounded-lg p-4 mb-8 max-w-md mx-auto "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center justify-center px-4 py-2">
            <QrCodeIcon className="size-36 text-primary" />
            <div className="mt-3">
              <p>
                <strong>Owner:</strong> {user?.name}
              </p>
              <p>
                <strong>Deposit:</strong> ${qrCode.deposit}
              </p>
              <p>
                <strong>Registered:</strong>{" "}
                {qrCode.isRegistered ? "Yes" : "No"}
              </p>
              <p>
                <strong>Disabled:</strong> {qrCode.isDisabled ? "Yes" : "No"}
              </p>
              <p>
                <strong>ID:</strong> {qrCode._id}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QRList;
