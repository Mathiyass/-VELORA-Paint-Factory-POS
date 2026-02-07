
import React from 'react';
import { X } from 'lucide-react';

export default function CustomerHistoryModal({ historyModalOpen, setHistoryModalOpen, selectedCustomer, customerHistory }) {
    if (!historyModalOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200 shadow-cyan-900/10">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-xl">
                    <div>
                        <h3 className="font-bold text-white text-lg">Purchase History</h3>
                        <p className="text-zinc-500 text-sm font-mono">{selectedCustomer?.name}</p>
                    </div>
                    <button onClick={() => setHistoryModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-zinc-950/50">
                    {customerHistory.length === 0 ? <p className="text-zinc-500 text-center py-10">No purchase history found.</p> :
                        customerHistory.map(tx => (
                            <div key={tx.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col gap-3">
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs font-bold font-mono">#{tx.id}</span>
                                        <span className="text-zinc-500 text-xs">{new Date(tx.timestamp).toLocaleString()}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tx.payment_method === 'Split' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900'}`}>
                                        {JSON.stringify(tx.payment_method).includes('[') ? 'Split' : tx.payment_method}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {tx.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm text-zinc-400">
                                            <span className="flex items-center gap-2">
                                                <span className="text-zinc-600 font-mono text-xs">x{item.quantity}</span>
                                                {item.name}
                                            </span>
                                            <span className="font-mono text-zinc-500">{item.price_sell.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-white items-center">
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Total</span>
                                    <span className="text-lg text-cyan-400">LKR {tx.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
