
import { useState } from 'react';
import { X } from 'lucide-react';

export default function OrderModal({ isOpen, onClose, onCreate, formulas }) {
    if (!isOpen) return null;
    const [newOrder, setNewOrder] = useState({ formula_id: '', quantity_planned: 1 });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            formula_id: parseInt(newOrder.formula_id),
            quantity_planned: parseFloat(newOrder.quantity_planned)
        });
        setNewOrder({ formula_id: '', quantity_planned: 1 });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Plan Production Run</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Select Formula</label>
                        <select
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                            value={newOrder.formula_id}
                            onChange={e => setNewOrder({ ...newOrder, formula_id: e.target.value })}
                        >
                            <option value="">Select Formula</option>
                            {formulas.map(f => (
                                <option key={f.id} value={f.id}>{f.name} (Std Yield: {f.standard_yield} {f.base_unit})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Planned Quantity</label>
                        <input
                            type="number" step="0.01" required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                            value={newOrder.quantity_planned}
                            onChange={e => setNewOrder({ ...newOrder, quantity_planned: e.target.value })}
                        />
                        <p className="text-xs text-zinc-500 mt-1">This will scale ingredient requirements automatically.</p>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">Create Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
