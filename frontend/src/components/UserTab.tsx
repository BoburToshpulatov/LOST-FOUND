import { motion } from "framer-motion";
import { useAuthStore } from "../store/useProfile";
import { Mail, Phone, User, UserCircleIcon } from "lucide-react";
import { useState } from "react";

const UserTab = () => {
  const [edit, setEdit] = useState<boolean>(false);

  const {
    user,
    formData,
    setFormData,
    updateProfile,
    fetchProfile,
    resetForm,
  } = useAuthStore();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    fetchProfile();
    resetForm();
    setEdit(false);
  };

  return (
    <motion.div
      className="bg-base-content/10 shadow-lg rounded-lg p-6 mb-8 max-w-md mx-auto "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col justify-center ">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <UserCircleIcon className="size-36 text-primary" />
          <div className="flex flex-col not-sm:items-center space-y-2">
            <h2 className="text-xl font-semibold">
              <strong>Name:</strong> {user?.name}
            </h2>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone}
            </p>
            <p>
              <strong>Backup Phone:</strong> {user?.backupPhone}
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary rounded-md btn-md mt-6"
          onClick={() => {
            if (user) {
              setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone,
                backupPhone: user.backupPhone,
              });
              setEdit(true);
            }
          }}
        >
          Update Profile
        </button>
      </div>
      {edit && user && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEdit(false)}
        >
          <motion.div
            className="bg-base-100 mx-auto relative max-w-[360px] w-full rounded-lg sm:px-8 py-6 px-4 shadow"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleUpdate} className="space-y-6">
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="backupPhone"
                  className="block text-sm font-medium "
                >
                  Backup Phone
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
                    inputMode="numeric"
                    pattern="^\+?[0-9]{10,15}$"
                    id="backupPhone"
                    required
                    value={formData.backupPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backupPhone: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary rounded-md btn-md w-full"
              >
                Update
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserTab;
