import React, { useState, useEffect } from 'react';
import { Plus, Search, Play, CheckCircle, Clock, AlertTriangle, Package, ChevronRight, Activity } from 'lucide-react';

export default function ProductionOrders() {
    const [orders, setOrders] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newOrder, setNewOrder] = useState({ formula_id: '', quantity_planned: 1 });

    const fetchOrders = async () => {
        if (window.api && window.api.getProductionOrders) {
            setOrders(await window.api.getProductionOrders());
        }
    };

    const fetchFormulas = async () => {
        if (window.api) setFormulas(await window.api.getFormulas());
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
        fetchFormulas();

    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            await window.api.createProductionOrder({
                formula_id: parseInt(newOrder.formula_id),
                quantity_planned: parseFloat(newOrder.quantity_planned)
            });
            setShowCreateModal(false);
            setNewOrder({ formula_id: '', quantity_planned: 1 });
            fetchOrders();
        }
    };

    const handleExecute = async (orderId) => {
        // For now, assume actual yield = planned qty. 
        // In a real scenario, we might want a modal to confirm actual yield.
        // But let's verify if we can proceed.
        if (confirm(`Execute production order? This will deduct chemicals based on FIFO and add stocks.`)) {
            try {
                if (window.api) {
                    await window.api.completeProductionOrder(orderId);
                    alert('Production completed successfully!');
                    fetchOrders();
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="text-cyan-500" size={32} />
                        Production Orders
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage manufacturing runs and batch execution</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> Plan Production
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map(po => {
                    const isCompleted = po.status === 'Completed';
                    return (
                        <div key={po.id} className={`bg-zinc-900/50 border rounded-2xl p-6 transition-all relative overflow-hidden ${isCompleted ? 'border-zinc-800 opacity-75' : 'border-zinc-700 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]'}`}>
                            {isCompleted && <div className="absolute top-0 right-0 p-4"><CheckCircle className="text-emerald-500" size={24} /></div>}
                            {!isCompleted && <div className="absolute top-0 right-0 p-4"><Clock className="text-amber-500" size={24} /></div>}

                            <div className="mb-4">
                                <span className="text-xs font-mono text-cyan-500 block mb-1">BATCH #{po.batch_code || `PO-${po.id}`}</span>
                                <h3 className="text-xl font-bold text-white mb-1">{po.formula_name}</h3>
                                <p className="text-sm text-zinc-400">Yield: {po.product_name || 'Generic Output'}</p>
                            </div>

                            <div className="flex justify-between items-center bg-zinc-950/50 rounded-xl p-4 mb-4 border border-zinc-900">
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase">Planned</div>
                                    <div className="text-lg font-bold text-white">{po.quantity_planned} Units</div>
                                </div>
                                {isCompleted && (
                                    <div className="text-right">
                                        <div className="text-xs text-zinc-500 uppercase">Produced</div>
                                        <div className="text-lg font-bold text-emerald-400">{po.quantity_produced} Units</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-xs text-zinc-500">
                                    {new Date(po.created_at).toLocaleDateString()}
                                </div>
                                {!isCompleted && (
                                    <button
                                        onClick={() => handleExecute(po.id, po.quantity_planned)}
                                        className="bg-zinc-800 hover:bg-cyan-600 hover:text-black text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                    >
                                        <Play size={14} /> Execute Run
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
                {orders.length === 0 && <div className="col-span-full text-center text-zinc-500 py-10">No production orders found.</div>}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Plan Production Run</h2>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
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
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">Create Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
