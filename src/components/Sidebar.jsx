import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  ClipboardList,
  SlidersHorizontal,
  FileText,
  ChevronDown,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '../lib/cn';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'obligations', label: 'Obligations', icon: ClipboardList },
  { id: 'controls', label: 'Controls', icon: SlidersHorizontal },
  { id: 'evidence', label: 'Evidence', icon: FileText },
];

function FilterGroup({ title, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 transition-colors hover:bg-gray-50"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-gray-100 px-3 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({
  searchTerm,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  selectedModules,
  onModuleChange,
  statusOptions,
  modulesData,
}) {
  const [statusOpen, setStatusOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('obligations');

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }}
      className="flex w-[260px] shrink-0 flex-col border-r border-gray-200/80 bg-white"
    >
      {/* Nav */}
      <nav className="shrink-0 space-y-0.5 p-3">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Workspace
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveNav(id)}
              className={cn(
                'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-citi-dark-blue'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-citi-blue'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border-l-[3px] border-citi-blue bg-citi-light-blue"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  'relative z-10 h-4 w-4 shrink-0',
                  isActive ? 'text-citi-blue' : 'text-gray-400'
                )}
                aria-hidden
              />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Filters — scrollable */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 pt-0">
        <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Filter className="h-3 w-3" aria-hidden />
          Filters
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 bg-nexus-surface py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-citi-blue focus:outline-none focus:ring-2 focus:ring-citi-blue/20"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <FilterGroup
          title="Obligation Status"
          open={statusOpen}
          onToggle={() => setStatusOpen((o) => !o)}
        >
          {statusOptions.length === 0 ? (
            <p className="text-xs text-gray-400">No statuses loaded</p>
          ) : (
            statusOptions.map((status) => (
              <label
                key={status.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 text-sm text-gray-700 hover:text-citi-dark-blue"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue/30"
                  checked={selectedStatuses.includes(status.id)}
                  onChange={() => onStatusChange(status.id)}
                />
                {status.label}
              </label>
            ))
          )}
        </FilterGroup>

        <FilterGroup
          title="Modules"
          open={modulesOpen}
          onToggle={() => setModulesOpen((o) => !o)}
        >
          {modulesData.length === 0 ? (
            <p className="text-xs text-gray-400">No modules loaded</p>
          ) : (
            modulesData.map((module) => (
              <label
                key={module.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 text-sm text-gray-700 hover:text-citi-dark-blue"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue/30"
                  checked={selectedModules.includes(module.id)}
                  onChange={() => onModuleChange(module.id)}
                />
                {module.label}
              </label>
            ))
          )}
        </FilterGroup>
      </div>

      {/* CTA */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, boxShadow: '0 0 16px rgba(201,150,59,0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-nexus-gold px-4 py-2.5 text-sm font-semibold text-nexus-navy"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New Assessment
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
