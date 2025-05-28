import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader,
  Lock,
  LogIn,
  LucideMailCheck,
  Mail,
  Verified,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useProfile";
import { useQrCode } from "../store/useQrCode";
import { useState } from "react";
import Instructions from "../components/Instructions";

const Login = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    login,
    resetForm,
    loading,
    verificationCode,
    setVerificationCode,
    resendVerificationCode,
    verifyEmailCode,
    verifyLoginCode,
    fetchProfile,
  } = useAuthStore();
  const { qrCode, registerQRCode, fetchQRCode } = useQrCode();

  const [instruction, setInstruction] = useState<boolean>(true);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<boolean>(false);
  const [verifyLogin, setVerifyLogin] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, status } = await login();
    if (status === 403) {
      setVerifyEmail(true);
      setVerifyCode(true);
      resendVerificationCode();
    }

    if (success) {
      setVerifyEmail(true);
      setVerifyLogin(true);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await verifyEmailCode(); // returns true/false

    if (success) {
      resetForm();
      setVerifyEmail(false);
      setVerifyCode(false);
      await registerQRCode(id!);
      fetchQRCode(id!);
      fetchProfile();
      navigate(`/owner`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await verifyLoginCode(); // returns true/false

    if (success) {
      resetForm();
      setVerifyLogin(false);
      setVerifyEmail(false);
      navigate(`/owner`);
      fetchProfile();
      if (!qrCode?.isRegistered) {
        await registerQRCode(id!);
        fetchQRCode(id!);
      }
    }
  };
  console.log(qrCode?.isRegistered);

  return (
    <div className="flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
          Welcome Back, Please Sign In
        </h2>
      </motion.div>

      <motion.div
        className="mt-8  mx-auto  w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-base-100 py-8 px-4 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5 text-base-content/50"
                    aria-hidden="true"
                  />
                </div>
                <input
                  minLength={6}
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                  placeholder="********"
                />
              </div>
            </div>

            <button
              type={verifyCode || verifyLogin ? "button" : "submit"}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-base-100 bg-primary hover:bg-primary-focus focus:outline-none focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out disabled:opacity-30 cursor-pointer"
              disabled={loading}
              onClick={() => setVerifyEmail(verifyCode || verifyLogin)}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : !verifyCode ? (
                !verifyLogin ? (
                  <>
                    <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign In
                  </>
                ) : (
                  <>
                    <Verified className="mr-2 h-5 w-5" aria-hidden="true" />
                    Enter Login Code
                  </>
                )
              ) : (
                <>
                  <Verified className="mr-2 h-5 w-5" aria-hidden="true" />
                  Enter Verification Code
                </>
              )}
            </button>
          </form>

          {!qrCode?.isRegistered && (
            <p className="mt-8 text-center text-sm text-base-content">
              Not a member?{" "}
              <Link
                onClick={() => resetForm()}
                to={`/sign-up/${id}`}
                className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out"
              >
                Sign up now <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          )}
        </div>
      </motion.div>

      {verifyEmail && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setVerifyEmail(false)}
        >
          <motion.form
            onSubmit={verifyCode ? handleVerify : handleLogin}
            className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-[340px] text-center space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold -mt-2">Verification Code</h2>

            <p className="text-sm text-base-content">
              Please check your email for a verification code.
            </p>

            <div className=" relative rounded-md shadow-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucideMailCheck
                  className="h-5 w-5 text-base-content/50"
                  aria-hidden="true"
                />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{6}$"
                id="verify-email"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-base-200 border border-base-content/20 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:base-content/50 focus:border-base-content/50 sm:text-sm"
                placeholder="123456"
              />
            </div>

            <button className="btn btn-primary w-full rounded-md">
              {verifyCode ? "Verify Your Account" : "Verify Your Login"}
            </button>
            <button
              className="text-sm text-base-content hover:text-primary underline cursor-pointer transition-all duration-300"
              type="button"
              onClick={() => resendVerificationCode()}
            >
              Didn't get a code? Resend
            </button>
          </motion.form>
        </motion.div>
      )}

      {instruction && !qrCode?.isRegistered && (
        <Instructions
          label="Welcome"
          instruction="To link this new QR code to your existing account, please log in.
If you don’t have an account yet, feel free to sign up."
          setInstruction={setInstruction}
        />
      )}
    </div>
  );
};

export default Login;
