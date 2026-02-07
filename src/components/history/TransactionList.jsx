
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionList({ transactions, selectedId, onSelect }) {
    return (
        <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-950/80 backdrop-blur sticky top-0 z-10 border-b border-zinc-800">
                        <tr className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
                            <th className="p-4 pl-6">ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4 text-right">Total (LKR)</th>
                            <th className="p-4 text-right">Profit</th>
                            <th className="p-4 text-center">Items</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-800/50">
                        <AnimatePresence>
                            {transactions.map(tx => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => onSelect(tx)}
                                    className={`hover:bg-zinc-800/60 cursor-pointer transition-colors ${selectedId === tx.id ? 'bg-cyan-900/10 border-l-2 border-cyan-500' : ''}`}
                                >
                                    <td className="p-4 pl-6 font-mono text-zinc-400 font-bold">#{tx.id}</td>
                                    <td className="p-4 text-sm text-zinc-300">
                                        <div className="font-medium text-white">{new Date(tx.timestamp).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${tx.customer_name ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-800/50 border-zinc-800 text-zinc-500'}`}>
                                            {tx.customer_name || 'Walk-in'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-cyan-400 font-mono text-base">{(tx.total ?? 0).toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono text-emerald-500/80 text-xs">+{(tx.profit ?? 0).toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full text-xs font-bold">{tx.items?.length ?? 0}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
