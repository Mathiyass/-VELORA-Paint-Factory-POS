import React from 'react';
import { X } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl shadow-cyan-900/10 overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 p-2 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-zinc-300">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
