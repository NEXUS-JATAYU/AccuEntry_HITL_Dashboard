import { AnimatePresence, motion } from 'framer-motion';
import { X, LayoutDashboard, ClipboardList, FileBarChart, Settings } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Obligations', icon: ClipboardList },
  { label: 'Reports', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
];

export default function MainSidebar({ isOpen, toggleSidebar }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-nexus-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
          <motion.aside
            className="fixed left-0 top-0 z-[60] flex h-full w-72 flex-col bg-white shadow-2xl"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-nexus-navy px-5 py-4">
              <span className="text-lg font-bold text-white">nexus</span>
              <button
                type="button"
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-white/80 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex-1 space-y-1 p-3">
              {menuItems.map(({ label, icon: Icon }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-citi-light-blue hover:text-citi-dark-blue"
                  >
                    <Icon className="h-4 w-4 text-citi-blue" aria-hidden />
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
