import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  History,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import MainSidebar from './Main-sidebar.jsx';
import { cn } from '../lib/cn';

export default function AccuEntryNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const handleSearch = () => {
    console.log('Search for:', searchValue);
  };

  return (
    <nav className="border-b border-nexus-gold/20 bg-nexus-navy shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/10"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <MainSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
              aria-hidden
            />
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-nexus-gold/40 focus:bg-white/15 focus:outline-none"
              placeholder="Search obligations..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <motion.button
            type="button"
            onClick={handleSearch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 rounded-xl bg-nexus-gold px-4 py-2.5 text-sm font-semibold text-nexus-navy transition-colors hover:bg-nexus-gold-light"
          >
            Run New Search
          </motion.button>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            title="History"
          >
            <History className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">History</span>
          </button>

          <button
            type="button"
            className="relative rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <motion.span
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-citi-red text-[10px] font-bold text-white"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              1
            </motion.span>
          </button>

          <button
            type="button"
            className={cn(
              'rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            )}
            title="Profile"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
