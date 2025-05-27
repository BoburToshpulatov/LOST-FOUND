import { motion } from "framer-motion";
import { useReportStore } from "../store/useReportStore";
import { useAuthStore } from "../store/useProfile";

const ReportTab = () => {
  const { reports, confirmReport, fetchUnconfirmedReports } = useReportStore();
  const { fetchProfile } = useAuthStore();

  const handleConfirmReward = async (reportId: string) => {
    await confirmReport(reportId);
    // You might want to refresh reports list after confirmation:
    fetchUnconfirmedReports();
    fetchProfile();
  };

  if (!reports.length) {
    // Show this if there are no reports
    return (
      <motion.div
        className="max-w-5xl mx-auto text-center py-20 text-base-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xl">No unconfirmed reports found.</p>
        <p className="mt-2">
          Once a finder reports a lost item, you'll see it here.
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
      {reports.map((item) => (
        <motion.div
          key={item._id}
          className="bg-base-content/10 shadow-lg rounded-lg p-4 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col gap-2 px-4 py-2">
            <h2 className="text-2xl font-semibold text-primary/90">Report</h2>
            <p>
              <strong>Finder Name:</strong> {item.finderName}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${item.finderPhone}`} className="link link-primary">
                {item.finderPhone}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${item.email}`} className="link link-primary">
                {item.email}
              </a>
            </p>
            {item.locationLink && (
              <p>
                <strong>Location:</strong>{" "}
                <a
                  href={item.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  View Location
                </a>
              </p>
            )}
            <p>
              <strong>Reward Claimed:</strong>{" "}
              {item.rewardClaimed ? "Yes" : "No"}
            </p>
            <p>
              <strong>Confirmed by Owner:</strong>{" "}
              {item.confirmedByOwner ? "Yes" : "No"}
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => handleConfirmReward(item._id)}
              disabled={item.confirmedByOwner} // disable if already confirmed
            >
              Confirm reward
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReportTab;
