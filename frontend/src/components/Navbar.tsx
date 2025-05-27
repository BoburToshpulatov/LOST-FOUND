import { Link } from "react-router-dom";
import { LogInIcon, LogOutIcon, QrCodeIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "../store/useProfile";
import { useQrCode } from "../store/useQrCode";

const Navbar = () => {
  const { logout, user } = useAuthStore();
  const { qrCode } = useQrCode();
  return (
    <div className="bg-base-100/80 backdrop:blur-md border-b border-base-content/10 fixed w-full top-0 left-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex-none">
            <Link
              to="/owner"
              className="hover:opacity-80 transition-opacity flex  items-center gap-2"
            >
              <QrCodeIcon className="size-9 text-primary" />
              <span
                className="font-semibold font-mono tracking-widest text-2xl bg-clip-text
                        text-transparent bg-gradient-to-r from-primary to-secondary"
              >
                LOST&FOUND
              </span>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-1">
            <ThemeSelector />

            {user ? (
              <button
                className="btn btn-ghost not-sm:btn-circle  text-base-content hover:bg-base-content/20 sm:rounded-md"
                onClick={() => logout()}
              >
                <LogOutIcon className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                className="btn btn-ghost not-sm:btn-circle  text-base-content hover:bg-base-content/20 sm:rounded-md"
                onClick={() => window.open(`/login/${qrCode?._id}`, "_self")}
              >
                <LogInIcon className="size-5" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
