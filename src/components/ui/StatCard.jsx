import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Card } from './Card';

export const StatCard = ({ title, value, color, subtext, onClick, trend, icon: Icon }) => {
    return (
        <motion.div
            whileHover={onClick ? { scale: 1.02 } : {}}
            transition={{ duration: 0.2 }}
            className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className={`absolute -inset-0.5 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-lg ${color}`} />
            <Card className="relative h-full border-zinc-800/80 bg-zinc-900/90 hover:bg-zinc-800/90 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{title}</p>
                        <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{value}</h3>
                    </div>
                    <div className={`p-2.5 rounded-xl ${color} bg-opacity-20 text-white shadow-inner`}>
                        <Icon size={20} />
                    </div>
                </div>
                {subtext && (
                    <div className="flex items-center gap-2">
                        {trend && (
                            <span className={`text-xs font-bold ${trend > 0 ? 'text-cyan-400 shadow-cyan-400/20 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]' : 'text-red-400'}`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                        <p className="text-xs text-zinc-500 font-medium">{subtext}</p>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};
