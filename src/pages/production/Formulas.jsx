import React, { useState, useEffect } from 'react';
import { Plus, Search, FlaskConical, Trash2, Edit2, X, Microscope } from 'lucide-react';
import Modal from '../../components/Modal';

export default function Formulas() {
    const [formulas, setFormulas] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [products, setProducts] = useState([]); // To link output product
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newFormula, setNewFormula] = useState({
        name: '',
        description: '',
        yield_quantity: 1,
        product_id: '', // Optional link to finished good
        ingredients: [] // { chemical_id, quantity_required }
    });

    const fetchData = async () => {
        if (window.api) {
            try {
                const form = await window.api.getFormulas();
                const chem = await window.api.getChemicals();
                const prod = await window.api.getProducts();
                setFormulas(form || []);
                setChemicals(chem || []);
                setProducts(prod || []);
            } catch (error) {
                console.error("Failed to fetch formulas data", error);
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();

    }, []);

    const filtered = (formulas || []).filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!newFormula.name || newFormula.ingredients.length === 0) {
            alert("Name and at least one ingredient required.");
            return;
        }

        try {
            await window.api.createFormula(newFormula);
            setIsModalOpen(false);
            setNewFormula({ name: '', description: '', yield_quantity: 1, product_id: '', ingredients: [] });
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to save formula');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this formula?')) {
            await window.api.deleteFormula(id);
            fetchData();
        }
    };

    const addIngredient = () => {
        setNewFormula(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { chemical_id: '', quantity_required: 0 }]
        }));
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...newFormula.ingredients];
        updated[index][field] = value;
        setNewFormula(prev => ({ ...prev, ingredients: updated }));
    };

    const removeIngredient = (index) => {
        const updated = newFormula.ingredients.filter((_, i) => i !== index);
        setNewFormula(prev => ({ ...prev, ingredients: updated }));
    };

    return (
        <div className="h-full flex flex-col p-8 bg-[var(--color-bg-app)] text-zinc-100 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Formulas & Recipes</h1>
                    <p className="text-zinc-500 mt-1">Define chemical compositions for products</p>
                </div>
                <button
                    onClick={() => { setNewFormula({ name: '', description: '', yield_quantity: 1, product_id: '', ingredients: [] }); setIsModalOpen(true); }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105"
                >
                    <Plus size={20} /> New Formula
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search formulas..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filtered.map(formula => (
                    <div key={formula.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-cyan-950/30 text-cyan-400 rounded-xl flex items-center justify-center text-xl font-bold border border-cyan-500/10">
                                <Microscope size={24} />
                            </div>
                            <button
                                onClick={() => handleDelete(formula.id)}
                                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{formula.name}</h3>
                        {formula.product_name && (
                            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                                Linked to: {formula.product_name}
                            </div>
                        )}
                        <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{formula.description || 'No description.'}</p>

                        <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase mb-2">
                                <span>Usage (for {formula.yield_quantity} qty)</span>
                                <span>Amt</span>
                            </div>
                            <div className="space-y-2">
                                {formula.ingredients.map((ing, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-zinc-300">{ing.chemical_name}</span>
                                        <span className="text-zinc-500 font-mono">{ing.quantity_required} {ing.unit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-full text-center py-20 text-zinc-500">No formulas defined.</div>}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Production Formula"
            >
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-400">Formula Name</label>
                        <input
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600"
                            value={newFormula.name}
                            onChange={e => setNewFormula({ ...newFormula, name: e.target.value })}
                            placeholder="e.g. Standard Red Gloss"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-400">Yield Quantity</label>
                            <input
                                type="number" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600"
                                value={newFormula.yield_quantity}
                                onChange={e => setNewFormula({ ...newFormula, yield_quantity: parseFloat(e.target.value) })}
                                min="1"
                                placeholder="1"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-400">Link Product</label>
                            <select
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                value={newFormula.product_id}
                                onChange={e => setNewFormula({ ...newFormula, product_id: parseInt(e.target.value) })}
                            >
                                <option value="">-- None --</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-400">Description</label>
                        <textarea
                            rows="2"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600"
                            value={newFormula.description}
                            onChange={e => setNewFormula({ ...newFormula, description: e.target.value })}
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="border-t border-zinc-800 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Ingredients</h3>
                            <button onClick={addIngredient} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                <Plus size={14} /> Add Material
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                            {newFormula.ingredients.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                    <div className="flex-1">
                                        <select
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                            value={item.chemical_id}
                                            onChange={e => updateIngredient(idx, 'chemical_id', parseInt(e.target.value))}
                                        >
                                            <option value="">Select Chemical...</option>
                                            {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                            placeholder="Req Qty" step="0.01"
                                            value={item.quantity_required}
                                            onChange={e => updateIngredient(idx, 'quantity_required', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <button onClick={() => removeIngredient(idx)} className="p-2 text-zinc-500 hover:text-red-400">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 hover:from-cyan-500 hover:to-blue-500 transition-all"
                        >
                            Save Formula
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
