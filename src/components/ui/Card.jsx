import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', title, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden shadow-sm ${className}`}
        >
            {(title || action) && (
                <div className="px-6 py-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/40">
                    {title && <h3 className="text-zinc-100 font-semibold tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </motion.div>
    );
};
