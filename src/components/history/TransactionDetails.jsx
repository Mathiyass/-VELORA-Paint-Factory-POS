/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Trash2, RotateCcw, Save } from 'lucide-react';

export default function TransactionDetails({ selectedTx, editMode, editData, actions }) {
    if (!selectedTx) return null;

    const { closeDetails, startEdit, cancelEdit, saveChanges, updateEditData, updateEditItemQuantity, removeEditItem } = actions;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="w-[400px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col z-30"
        >
            <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-white text-lg">Transaction Details</h2>
                    <p className="text-xs text-zinc-500 font-mono">ID: #{selectedTx.id}</p>
                </div>
                <button onClick={closeDetails} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-zinc-900/20">
                {!editMode ? (
                    // --- VIEW MODE ---
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                                <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Date</label>
                                <div className="text-zinc-200 text-sm font-medium">{new Date(selectedTx.timestamp).toLocaleDateString()}</div>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                                <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Time</label>
                                <div className="text-zinc-200 text-sm font-medium">{new Date(selectedTx.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-2 block">Customer Info</label>
                            <div className="flex items-center gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                <div className="w-10 h-10 rounded-full bg-cyan-900/30 text-cyan-500 flex items-center justify-center font-bold text-lg">
                                    {(selectedTx.customer_name || 'W').charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{selectedTx.customer_name || 'Walk-in Customer'}</div>
                                    <div className="text-xs text-zinc-500">Payment: {(() => {
                                        try {
                                            const pm = typeof selectedTx.payment_method === 'string'
                                                ? JSON.parse(selectedTx.payment_method)
                                                : selectedTx.payment_method;
                                            if (Array.isArray(pm)) {
                                                return pm.map(p => p.method || p).join(', ');
                                            }
                                            return pm?.method || pm || 'Cash';
                                        } catch {
                                            return selectedTx.payment_method || 'Cash';
                                        }
                                    })()}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-2 block flex justify-between">
                                <span>Items Purchased</span>
                                <span className="text-zinc-400">{selectedTx.items.length} Items</span>
                            </label>
                            <div className="space-y-2">
                                {selectedTx.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800/50">
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-zinc-200">{item.name}</div>
                                            <div className="text-xs text-zinc-500 font-mono mt-0.5">
                                                {item.quantity} x {(item.price_sell ?? 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-cyan-400 font-mono">
                                            {(item.quantity * (item.price_sell ?? 0)).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-zinc-800">
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Subtotal</span>
                                <span>{(selectedTx.total ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Discount</span>
                                <span>0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-white font-bold">Total Paid</span>
                                <span className="text-2xl font-black text-cyan-500">LKR {(selectedTx.total ?? 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    // --- EDIT MODE ---
                    <div className="space-y-6">
                        <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-xl">
                            <div className="flex gap-2 text-amber-500 font-bold text-xs uppercase mb-1">
                                <RotateCcw size={14} /> Warning
                            </div>
                            <p className="text-xs text-amber-100/70 leading-relaxed">
                                Modifying this transaction will automatically adjust stock levels for the affected products.
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Customer Name</label>
                            <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-cyan-500 outline-none transition-colors"
                                value={editData.customer_name} onChange={e => updateEditData('customer_name', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Date</label>
                            <input type="datetime-local" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-cyan-500 outline-none transition-colors"
                                value={editData.timestamp.slice(0, 16)} onChange={e => updateEditData('timestamp', e.target.value)} />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-2 block">Items (Adjust Qty)</label>
                            <div className="space-y-2">
                                {editData.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className="overflow-hidden flex-1 mr-2">
                                            <div className="text-sm font-bold text-zinc-200 truncate">{item.name}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">
                                                {(item.price_sell ?? 0).toLocaleString()} / unit
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                                            <button
                                                onClick={() => updateEditItemQuantity(i, -1)}
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400"
                                            >
                                                -
                                            </button>
                                            <span className="font-mono text-white w-6 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateEditItemQuantity(i, 1)}
                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button onClick={() => removeEditItem(i)} className="ml-2 text-zinc-600 hover:text-red-500 p-1.5 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-3">
                {!editMode ? (
                    <>
                        <button
                            onClick={() => actions.printInvoice(selectedTx)}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                        >
                            <FileText size={18} /> Print Invoice
                        </button>
                        <button
                            onClick={startEdit}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all"
                        >
                            Edit / Correct Invoice
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <button onClick={cancelEdit} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3.5 rounded-xl transition-colors">Cancel</button>
                        <button onClick={saveChanges} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] flex justify-center items-center gap-2 transition-all">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
