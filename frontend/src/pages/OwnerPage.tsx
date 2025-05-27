import { useEffect, useState } from "react";
import { FileCheck, QrCodeIcon, User2Icon } from "lucide-react";
import { motion } from "framer-motion";
import UserTab from "../components/UserTab";
import QRList from "../components/QRList";
import ReportTab from "../components/ReportTab";
import { useReportStore } from "../store/useReportStore";

type Tab = {
  id: string;
  label: string;
  icon: any;
};

const tabs: Tab[] = [
  { id: "user", label: "User Profile", icon: User2Icon },
  { id: "qr-codes", label: "Stickers", icon: QrCodeIcon },
  { id: "reports", label: "Reports", icon: FileCheck },
];

const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState<string>("user");
  const { fetchUnconfirmedReports } = useReportStore();

  useEffect(() => {
    fetchUnconfirmedReports();
  }, [fetchUnconfirmedReports]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-primary/90 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Owner Dashboard
        </motion.h1>

        <div className="flex  justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={` btn btn-sm    mx-1 sm:mx-2 sm:btn-md  rounded-md  ${
                activeTab === tab.id
                  ? "bg-primary/85 "
                  : "bg-base-content/10 text-base-content hover:bg-base-content/20"
              }`}
            >
              <tab.icon className=" h-5 w-5 shrink-0 " />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "user" && <UserTab />}
        {activeTab === "qr-codes" && <QRList />}
        {activeTab === "reports" && <ReportTab />}
      </div>
    </div>
  );
};

export default OwnerPage;
