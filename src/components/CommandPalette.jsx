import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingCart, Package, Users, BarChart2, Settings, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const options = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'POS Terminal', icon: ShoppingCart, path: '/pos' },
    { label: 'Inventory / Stock', icon: Package, path: '/stock' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Reports', icon: BarChart2, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, isOpen]);

  const handleSelect = (option) => {
    navigate(option.path);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[selectedIndex]) {
        handleSelect(filteredOptions[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-zinc-800 gap-3">
              <Search className="text-zinc-500" size={20} />
              <input
                autoFocus
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 text-lg"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700 font-mono">ESC</div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-zinc-500">No results found.</div>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((opt, i) => (
                    <button
                      key={opt.path}
                      onClick={() => handleSelect(opt)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        i === selectedIndex ? 'bg-cyan-600/20 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <opt.icon size={20} className={i === selectedIndex ? 'text-cyan-400' : 'text-zinc-500'} />
                      <span className="font-medium">{opt.label}</span>
                      {i === selectedIndex && <Command size={14} className="ml-auto opacity-50" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between">
              <span>Navigate with <span className="font-mono">↑↓</span> and <span className="font-mono">Enter</span></span>
              <span>Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
