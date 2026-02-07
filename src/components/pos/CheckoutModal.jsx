
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Award, Trash2 } from 'lucide-react';

export default function CheckoutModal({
    isOpen,
    onClose,
    total,
    onProcess,
    customer,
    setCustomer,
    customerPoints,
    usePoints,
    setUsePoints
}) {
    const [paymentMode, setPaymentMode] = useState('Simple');
    const [simpleMethod, setSimpleMethod] = useState('Cash');
    const [splitPayments, setSplitPayments] = useState([{ method: 'Cash', amount: total }]);

    useEffect(() => {
        if (isOpen && paymentMode === 'Simple') {
            // Reset simple method if needed
        }
        if (isOpen && paymentMode === 'Split') {
            if (splitPayments.length === 0) setSplitPayments([{ method: 'Cash', amount: total }]);
        }
    }, [isOpen, total, paymentMode, splitPayments.length]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalPaymentMethod = [];
        if (paymentMode === 'Simple') {
            finalPaymentMethod = [{ method: simpleMethod, amount: total }];
        } else {
            const sum = splitPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
            if (Math.abs(sum - total) > 1) {
                alert(`Total payment (${sum.toLocaleString()}) must match Invoice Total (${total.toLocaleString()})`);
                return;
            }
            finalPaymentMethod = splitPayments;
        }

        onProcess(finalPaymentMethod);
    };

    // Split Helpers
    const addSplitRow = () => setSplitPayments([...splitPayments, { method: 'Cash', amount: 0 }]);
    const updateSplitRow = (idx, field, val) => {
        const newRows = [...splitPayments];
        newRows[idx][field] = val;
        setSplitPayments(newRows);
    };
    const removeSplitRow = (idx) => setSplitPayments(splitPayments.filter((_, i) => i !== idx));


    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-cyan-900/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Complete Transaction</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Customer</label>
                        <input autoFocus className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-600 text-white"
                            placeholder="Customer Name (Optional)"
                            value={customer} onChange={e => setCustomer(e.target.value)}
                        />
                        {customerPoints > 0 && (
                            <div className="mt-2 flex justify-between items-center bg-emerald-900/10 border border-emerald-500/30 p-2 rounded-lg">
                                <div className="text-emerald-400 text-sm font-bold flex items-center gap-1"><Award size={16} /> {customerPoints} Points</div>
                                <button type="button" onClick={() => setUsePoints(!usePoints)} className={`text-xs font-bold px-3 py-1 rounded ${usePoints ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-emerald-400'}`}>
                                    {usePoints ? 'Applied' : 'Redeem'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex gap-2 mb-4 bg-zinc-950 p-1 rounded-xl">
                            <button type="button" onClick={() => setPaymentMode('Simple')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${paymentMode === 'Simple' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>Simple</button>
                            <button type="button" onClick={() => setPaymentMode('Split')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${paymentMode === 'Split' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>Split / Multi</button>
                        </div>

                        {paymentMode === 'Simple' ? (
                            <div className="grid grid-cols-3 gap-3">
                                {['Cash', 'Card', 'Credit'].map(m => (
                                    <button key={m} type="button" onClick={() => setSimpleMethod(m)}
                                        className={`py-3 rounded-xl border font-bold ${simpleMethod === m ? 'bg-cyan-600 border-cyan-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                {splitPayments.map((row, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <select value={row.method} onChange={e => updateSplitRow(idx, 'method', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm outline-none">
                                            <option>Cash</option><option>Card</option><option>Credit</option><option>Transfer</option>
                                        </select>
                                        <input type="number" value={row.amount} onChange={e => updateSplitRow(idx, 'amount', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm outline-none" placeholder="Amount" />
                                        <button type="button" onClick={() => removeSplitRow(idx)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addSplitRow} className="text-xs text-cyan-500 font-bold hover:underline">+ Add Method</button>

                                <div className="pt-2 border-t border-zinc-800 text-right">
                                    <span className="text-zinc-500 text-xs mr-2">Remaining:</span>
                                    <span className={`font-bold ${Math.abs(splitPayments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0) - total) > 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {(total - splitPayments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mb-6 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-zinc-400">Total Payable</span>
                        <span className="text-xl font-bold text-cyan-400">LKR {total.toLocaleString()}</span>
                    </div>

                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                        Finalize Sale
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
