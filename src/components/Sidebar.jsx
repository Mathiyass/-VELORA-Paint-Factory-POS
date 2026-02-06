import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, History, Settings, LogOut, Shield, Factory, FlaskConical, ClipboardList, DollarSign, ChevronDown, ChevronRight, Store, Box } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState({
    factory: true,
    production: true,
    finance: false,
    shop: false
  });

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  // Premium Neon Link Styles
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${isActive
      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-400 border-l-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 hover:pl-5 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-all duration-200 text-sm pl-11 relative ${isActive
      ? 'text-cyan-400 bg-cyan-950/30'
      : 'text-zinc-500 hover:text-zinc-200'
    }`;

  const renderSubMenu = (key, label, Icon, items) => {
    const isExpanded = expanded[key];
    const isActive = items.some(i => location.pathname === i.path);

    return (
      <div className="mb-1">
        <button
          onClick={() => toggle(key)}
          className={`w-[calc(100%-16px)] mx-2 flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive || isExpanded ? 'text-zinc-100 bg-zinc-800/40' : 'text-zinc-400 hover:bg-zinc-800/30'
            }`}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} />
            <span className="font-medium text-sm">{label}</span>
          </div>
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} className={isActive ? 'text-cyan-400' : ''} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-0.5 mt-0.5"
            >
              {items.map(item => (
                <NavLink key={item.path} to={item.path} className={subLinkClass}>
                  <div className={`absolute left-9 w-1 h-1 rounded-full ${location.pathname === item.path ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-zinc-700'}`} />
                  {item.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <aside className="w-72 bg-bg-app border-r border-zinc-900 flex flex-col h-screen shrink-0 relative z-50">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-900 bg-bg-app/50 backdrop-blur-md z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10 group cursor-pointer hover:scale-105 transition-transform duration-300">
          <Factory className="text-black w-6 h-6" />
        </div>
        <div className="ml-3 relative z-10">
          <h1 className="font-bold text-lg text-white tracking-wide leading-none">VELORA<span className="block text-[10px] text-cyan-400 font-extrabold tracking-[0.2em] uppercase mt-0.5">PAINT FACTORY</span></h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar z-10">
        <div className="px-6 text-[10px] uppercase font-bold text-zinc-600 mb-2 mt-1 tracking-widest">Overview</div>
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard</span>
        </NavLink>
        <NavLink to="/reports" className={linkClass}>
          <ClipboardList size={18} />
          <span className="font-medium text-sm">Reports</span>
        </NavLink>

        <div className="px-6 text-[10px] uppercase font-bold text-zinc-600 mb-2 mt-6 tracking-widest">Operations</div>

        {renderSubMenu('factory', 'Factory', FlaskConical, [
          { path: '/factory/suppliers', label: 'Suppliers' },
          { path: '/factory/chemicals', label: 'Chemicals' },
          { path: '/factory/purchase-orders', label: 'Purchase Orders' },
        ])}

        {renderSubMenu('production', 'Production', Factory, [
          { path: '/production/formulas', label: 'Formulas' },
          { path: '/production/orders', label: 'Job Orders' },
        ])}

        {renderSubMenu('shop', 'Inventory', Box, [
          { path: '/stock', label: 'Stock Levels' },
          { path: '/pos', label: 'Point of Sale' },
        ])}

        <div className="px-6 text-[10px] uppercase font-bold text-zinc-600 mb-2 mt-6 tracking-widest">Management</div>

        {renderSubMenu('finance', 'Finance', DollarSign, [
          { path: '/finance/expenses', label: 'Expenses' },
          { path: '/finance/employees', label: 'Payroll' },
        ])}

        <NavLink to="/customers" className={linkClass}>
          <Users size={18} />
          <span className="font-medium text-sm">CRM</span>
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          <History size={18} />
          <span className="font-medium text-sm">Sales History</span>
        </NavLink>

        {user?.role === 'admin' && (
          <>
            <div className="px-6 text-[10px] uppercase font-bold text-zinc-600 mb-2 mt-6 tracking-widest">System</div>
            <NavLink to="/users" className={linkClass}>
              <Shield size={18} />
              <span className="font-medium text-sm">Access Control</span>
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              <Settings size={18} />
              <span className="font-medium text-sm">Global Settings</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950 relative z-20">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-cyan-500/30 transition-colors group">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-black shadow-[0_0_10px_rgba(255,107,107,0.3)] ${user?.role === 'admin' ? 'bg-gradient-to-tr from-red-500 to-orange-400' : 'bg-zinc-700 text-white'}`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm text-zinc-200 font-bold truncate w-24 group-hover:text-cyan-400 transition-colors">{user?.name}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
