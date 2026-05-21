import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  History,
  Bell,
  User,
  Settings,
  MapPin,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import keycloak from '../keycloak.js';
import MainSidebar from './Main-sidebar.jsx';
import { cn } from '../lib/cn';

export default function DashboardHeader({ onSearch, searchValue, onSearchChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const handleSearch = () => onSearch?.(searchValue);

  useEffect(() => {
    if (!settingsOpen) return;

    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [settingsOpen]);

  const handleLogout = () => {
    setSettingsOpen(false);
    keycloak.logout();
  };

  return (
    <motion.header
      className="sticky top-0 z-40 w-full shadow-sm"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    >
      <div className="border-b border-gray-200/60 bg-white">
        <div className="flex h-10 w-full items-center justify-between px-3 lg:px-5">
          <button
            type="button"
            onClick={() => { window.location.href = '/'; }}
            className="text-2xl font-bold tracking-tight text-citi-blue transition-colors hover:text-citi-dark-blue"
          >
            nexus
          </button>
          <div className="hidden items-center gap-2 px-4 md:flex">
            <span className="text-xs font-bold text-gray-700">DICGC</span>
            <span className="max-w-lg text-xs text-gray-500">
              DICGC-Insured · Backed by the full faith and credit of the Indian Government
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <a
              href="#"
              className="hidden items-center gap-1.5 transition-colors hover:text-citi-blue sm:flex"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              ATM / BRANCH
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-nexus-navy">
        <div className="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 lg:px-5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg p-2 text-white/90 hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <MainSidebar isOpen={menuOpen} toggleSidebar={() => setMenuOpen(false)} />

          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search obligations..."
              className="w-full rounded-full border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-nexus-gold/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-nexus-gold/30"
            />
          </div>

          <motion.button
            type="button"
            onClick={handleSearch}
            whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(201,150,59,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 rounded-full bg-nexus-gold px-5 py-2 text-sm font-semibold text-nexus-navy"
          >
            Run New Search
          </motion.button>

          <div className="ml-auto hidden items-center gap-0.5 sm:flex">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              title="History"
              className="rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <History className="h-4 w-4" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              title="Notifications"
              className="relative rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <motion.span
                className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-citi-red text-[9px] font-bold text-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                1
              </motion.span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              title="Profile"
              className="rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" />
            </motion.button>

            <div className="relative" ref={settingsRef}>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                onClick={() => setSettingsOpen((o) => !o)}
                aria-expanded={settingsOpen}
                aria-haspopup="menu"
                aria-label="Settings"
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white',
                  settingsOpen && 'bg-white/10 text-white'
                )}
              >
                <Settings className="h-4 w-4" />
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform', settingsOpen && 'rotate-180')}
                  aria-hidden
                />
              </motion.button>

              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl shadow-black/20"
                  >
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-xs font-semibold text-gray-900">Settings</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">Compliance dashboard</p>
                    </div>

                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setSettingsOpen(false)}
                    >
                      <User className="h-4 w-4 text-gray-400" aria-hidden />
                      Account preferences
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setSettingsOpen(false)}
                    >
                      <Bell className="h-4 w-4 text-gray-400" aria-hidden />
                      Notification settings
                    </button>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-citi-red transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" aria-hidden />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        <motion.div
          key="compliance-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden border-b border-citi-blue/20 bg-citi-light-blue"
        >
          <div className="flex w-full items-center justify-between px-3 py-2 text-xs lg:px-5">
            <span className="font-semibold text-citi-dark-blue">Compliance Operations Center</span>
            <motion.span
              className="flex items-center gap-1.5 text-citi-blue"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-nexus-emerald" />
              Live data sync
            </motion.span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.header>
  );
}
