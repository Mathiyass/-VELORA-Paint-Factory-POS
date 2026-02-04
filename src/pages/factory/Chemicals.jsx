import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, FlaskConical, AlertTriangle, Layers, Calendar, DollarSign, Package } from 'lucide-react';

export default function Chemicals() {
    const [chemicals, setChemicals] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedChemical, setSelectedChemical] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', sku: '', unit: 'kg', reorder_level: 10 });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchChemicals = async () => {
        if (window.api) {
            const data = await window.api.getChemicals();
            setChemicals(data);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChemicals();

    }, []);

    const fetchBatches = async (chemId) => {
        if (window.api) {
            const data = await window.api.getBatches(chemId);
            setBatches(data);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            await window.api.addChemical(formData);
            setShowAddModal(false);
            setFormData({ name: '', sku: '', unit: 'kg', reorder_level: 10 });
            fetchChemicals();
        }
    };

    const openBatchModal = (chem) => {
        setSelectedChemical(chem);
        fetchBatches(chem.id);
        setShowBatchModal(true);
    };

    const filteredChemicals = chemicals.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-zinc-100 p-8 overflow-y-auto custom-scrollbar font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FlaskConical className="text-cyan-500" size={32} />
                        Chemical Inventory
                    </h1>
                    <p className="text-zinc-500 mt-1">Raw material stock levels and reorder management</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> Add Chemical
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search chemicals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChemicals.map(chem => {
                    const isLowStock = chem.current_stock <= chem.reorder_level;
                    return (
                        <div key={chem.id} className={`bg-zinc-900/50 border rounded-2xl p-6 transition-all group relative overflow-hidden ${isLowStock ? 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-zinc-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/10'}`}>
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 pointer-events-none ${isLowStock ? 'bg-red-600/10' : 'bg-cyan-600/5'}`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-zinc-100 truncate pr-2">{chem.name}</h3>
                                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{chem.sku || 'NO-SKU'}</span>
                                </div>
                                <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                    {isLowStock ? <AlertTriangle size={20} /> : <FlaskConical size={20} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">Current Stock</div>
                                    <div className={`text-xl font-bold ${isLowStock ? 'text-red-500' : 'text-emerald-400'}`}>
                                        {chem.current_stock?.toFixed(2)} <span className="text-sm font-normal text-zinc-600">{chem.unit}</span>
                                    </div>
                                </div>
                                <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-900">
                                    <div className="text-xs text-zinc-500 mb-1">Reorder Level</div>
                                    <div className="text-xl font-bold text-zinc-300">
                                        {chem.reorder_level} <span className="text-sm font-normal text-zinc-600">{chem.unit}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => openBatchModal(chem)}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-700 group-hover:border-zinc-600"
                            >
                                <Layers size={16} /> View Lots / Batches
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl shadow-cyan-900/20">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Add New Chemical</h2>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Chemical Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">SKU / Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Unit</label>
                                    <select
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="l">Liter (L)</option>
                                        <option value="g">Gram (g)</option>
                                        <option value="ml">Milliliter (ml)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Reorder Level</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.reorder_level}
                                    onChange={e => setFormData({ ...formData, reorder_level: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20"
                                >
                                    Add Chemical
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Batch View Modal */}
            {showBatchModal && selectedChemical && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Layers className="text-cyan-500" /> Bin Card: {selectedChemical.name}
                                </h2>
                                <p className="text-zinc-500 text-sm mt-1">Lot Genealogy & Stock History</p>
                            </div>
                            <button onClick={() => setShowBatchModal(false)} className="text-zinc-500 hover:text-white">Close</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-zinc-500 text-sm border-b border-zinc-800">
                                        <th className="font-medium p-3">Batch / Lot #</th>
                                        <th className="font-medium p-3">Supplier</th>
                                        <th className="font-medium p-3">Received</th>
                                        <th className="font-medium p-3">Expiry</th>
                                        <th className="font-medium p-3">Cost</th>
                                        <th className="font-medium p-3 text-right">Qty Remaining</th>
                                        <th className="font-medium p-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-300">
                                    {batches.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center p-8 text-zinc-500">No active batches found.</td></tr>
                                    ) : batches.map(batch => (
                                        <tr key={batch.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                                            <td className="p-3">
                                                <div className="font-medium text-white">{batch.internal_lot_number}</div>
                                                <div className="text-xs text-zinc-500">{batch.batch_number}</div>
                                            </td>
                                            <td className="p-3 text-sm">{batch.supplier_name || 'N/A'}</td>
                                            <td className="p-3 text-sm flex items-center gap-2">
                                                <Calendar size={14} className="text-zinc-600" />
                                                {new Date(batch.received_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-sm">{batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString() : '-'}</td>
                                            <td className="p-3 text-sm">
                                                LKR {batch.cost_per_unit?.toFixed(2)}
                                            </td>
                                            <td className="p-3 text-right font-medium text-white">
                                                {batch.quantity_remaining.toFixed(2)} / {batch.quantity_initial}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${batch.quantity_remaining === 0 ? 'bg-zinc-800 text-zinc-500' :
                                                    batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {batch.quantity_remaining === 0 ? 'Depleted' : batch.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
