import { motion } from 'framer-motion';
import { MapPin, LogOut } from 'lucide-react';
import keycloak from '../keycloak.js';

function Header() {
  const handleNexusClick = () => {
    window.location.href = '/';
  };

  return (
    <motion.header
      className="w-full border-b border-slate-200/80 bg-white"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={handleNexusClick}
          className="font-display text-2xl font-bold tracking-tight text-citi-blue transition-colors hover:text-citi-dark-blue"
          aria-label="Go to home page"
        >
          nexus
        </button>
        <div className="hidden flex-1 items-center justify-center gap-2 px-4 md:flex">
          <span className="text-xs font-bold text-slate-700">FDIC</span>
          <span className="max-w-md text-center text-xs text-slate-500">
            FDIC-Insured · Backed by the full faith and credit of the U.S. Government
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-citi-blue sm:flex"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            ATM / BRANCH
          </a>
          <a
            href="#"
            className="hidden text-xs text-slate-500 transition-colors hover:text-citi-blue sm:inline"
          >
            ESPAÑOL
          </a>
          <button
            type="button"
            onClick={() => keycloak.logout()}
            className="flex items-center gap-1.5 rounded-lg border border-transparent bg-nexus-navy-light px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-nexus-gold/50 hover:bg-nexus-navy"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Logout
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
