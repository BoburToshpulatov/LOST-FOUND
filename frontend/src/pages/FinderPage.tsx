import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Instructions from "../components/Instructions";
import useUserLocation from "../lib/LocationLink";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { useReportStore } from "../store/useReportStore";
import { useQrCode } from "../store/useQrCode";

type Form = {
  finderName: string;
  finderPhone: string;
  email: string;
  locationLink: string;
};

const FinderPage = () => {
  const { id } = useParams();
  const { owner } = useQrCode();
  const locationLink = useUserLocation();
  const [instruction, setInstruction] = useState<boolean>(true);
  const [ownerInfo, setOwnerInfo] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    finderName: "",
    finderPhone: "",
    email: "",
    locationLink: "",
  });

  const { submitReport } = useReportStore();

  useEffect(() => {
    if (locationLink) {
      setForm((prev) => ({ ...prev, locationLink }));
    }
  }, [locationLink]);

  const handleChange = (field: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      finderName: "",
      finderPhone: "",
      email: "",
      locationLink: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitReport(id!, form);
    if (success) {
      resetForm();
      setOwnerInfo(true);
    }
  };
  return (
    <div className="flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mt-6 text-center text-4xl font-extrabold text-primary">
          {ownerInfo ? "Report Submitted!" : "Found Something?"}
        </h2>
        <p className="text-base-content text-lg text-center mt-2">
          {ownerInfo
            ? "We've notified the owner. You can also reach out directly using the contact details below."
            : "Fill out this short form and we'll notify the owner for you."}
        </p>
      </motion.div>

      <motion.div
        className="mt-8  mx-auto  w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {ownerInfo ? (
          <div className="bg-base-100 py-4 px-2 shadow rounded-lg flex flex-col items-center justify-center sm:px-10 mb-1 space-y-1">
            <h2 className="text-2xl font-bold mb-2">Owner Information</h2>

            <p>
              <strong>Name:</strong> {owner?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${owner?.email}`}
                className="hover:text-primary transition-all duration-200 underline"
              >
                {owner?.email}
              </a>
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${owner?.phone}`}
                className="hover:text-primary transition-all duration-200 underline"
              >
                {owner?.phone}
              </a>
            </p>

            <p>
              <strong>Backup Phone:</strong>{" "}
              <a
                href={`tel:${owner?.backupPhone}`}
                className="hover:text-primary transition-all duration-200  underline"
              >
                {owner?.backupPhone}
              </a>
            </p>
          </div>
        ) : (
          <div className="bg-base-100 py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-base-content"
                >
                  Full name
                </label>
                <div className="mt-1 relative rounded-md shadow-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className="h-5 w-5 text-base-content/50"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.finderName}
                    onChange={(e) => handleChange("finderName", e.target.value)}
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium ">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-base-content/50"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium ">
                  Phone
                </label>
                <div className="mt-1 relative rounded-md shadow-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone
                      className="h-5 w-5 text-base-content/50"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    inputMode="numeric"
                    pattern="^\+?[0-9]{10,15}$"
                    required
                    value={form.finderPhone}
                    onChange={(e) =>
                      handleChange("finderPhone", e.target.value)
                    }
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-base-content"
                >
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin
                      className="h-5 w-5 text-base-content/50"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="url"
                    id="location"
                    value={form.locationLink}
                    onChange={(e) =>
                      handleChange("locationLink", e.target.value)
                    }
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              {form.locationLink && (
                <a
                  href={form.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md rounded-md"
                >
                  View on Google Maps
                </a>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full rounded-md"
              >
                Send to Owner
              </button>
            </form>
          </div>
        )}
      </motion.div>

      {instruction && (
        <Instructions
          label="Found a lost item?"
          instruction="Please help us return it to its rightful owner.

You’ll be shown the owner’s contact details (phone and email) after submitting this form.

Fill out the form below with your contact info and location.

If the owner confirms the item was truly theirs, you’ll receive a $0.50 reward as a thank-you!"
          setInstruction={setInstruction}
        />
      )}
    </div>
  );
};

export default FinderPage;
