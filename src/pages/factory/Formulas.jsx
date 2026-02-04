import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, FlaskConical, Atom, FileSymlink, ChevronRight, Calculator } from 'lucide-react';

export default function Formulas() {
    const [formulas, setFormulas] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        yield_quantity: 1,
        product_id: '',
        ingredients: []
    });

    const fetchData = async () => {
        if (window.api) {
            setFormulas(await window.api.getFormulas());
            setChemicals(await window.api.getChemicals());
            setProducts(await window.api.getProducts());
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();

    }, []);

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { chemical_id: '', quantity_required: 0 }]
        });
    };

    const updateIngredient = (index, field, value) => {
        const newIngs = [...formData.ingredients];
        newIngs[index][field] = value;
        setFormData({ ...formData, ingredients: newIngs });
    };

    const removeIngredient = (index) => {
        const newIngs = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            // Format payload
            const payload = {
                ...formData,
                ingredients: formData.ingredients.map(i => ({
                    chemical_id: parseInt(i.chemical_id),
                    quantity_required: parseFloat(i.quantity_required)
                }))
            };
            await window.api.createFormula(payload);
            setShowModal(false);
            setFormData({ name: '', code: '', description: '', yield_quantity: 1, product_id: '', ingredients: [] });
            fetchData();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure? This will delete the recipe and ingredients.')) {
            if (window.api) {
                await window.api.deleteFormula(id);
                fetchData();
            }
        }
    };

    const filteredFormulas = formulas.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Atom className="text-cyan-500" size={32} />
                        Formulas & Recipes
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage production recipes and linked ingredients</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> New Formula
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search formulas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFormulas.map(formula => (
                    <div key={formula.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                    {formula.name}
                                    {formula.product_name && <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900/50">Linked: {formula.product_name}</span>}
                                </h3>
                                <p className="text-zinc-500 text-sm mt-1">{formula.description || 'No description'}</p>
                            </div>
                            <button onClick={() => handleDelete(formula.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>

                        <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-900 mb-4">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-zinc-400">Standard Yield</span>
                                <span className="font-bold text-white">{formula.standard_yield || formula.yield_quantity} L</span>
                            </div>
                            <div className="border-t border-zinc-800 my-2"></div>
                            <div className="space-y-1">
                                {formula.ingredients.map((ing, i) => (
                                    <div key={i} className="flex justify-between text-xs text-zinc-400">
                                        <span>{ing.chemical_name}</span>
                                        <span>{ing.quantity_required} {ing.unit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Create New Formula</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Formula Name</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Link to Product (Optional)</label>
                                        <select
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                            value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                                        >
                                            <option value="">No Link</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                                    <textarea
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Standard Yield Qty</label>
                                        <input
                                            type="number" required
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                            value={formData.yield_quantity} onChange={e => setFormData({ ...formData, yield_quantity: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-zinc-500 text-sm mt-6">Unit: Liters (L) - Standard</span>
                                    </div>
                                </div>

                                {/* Ingredients */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-zinc-300 uppercase">Ingredients</h3>
                                        <button type="button" onClick={handleAddIngredient} className="text-cyan-500 text-sm font-bold hover:text-cyan-400">+ Add Ingredient</button>
                                    </div>
                                    <div className="space-y-3 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                                        {formData.ingredients.length === 0 && <p className="text-center text-zinc-600 text-sm">No ingredients added.</p>}
                                        {formData.ingredients.map((ing, idx) => (
                                            <div key={idx} className="flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <label className="text-xs text-zinc-500 block mb-1">Raw Material</label>
                                                    <select
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-600"
                                                        value={ing.chemical_id} onChange={e => updateIngredient(idx, 'chemical_id', e.target.value)}
                                                    >
                                                        <option value="">Select Chemical</option>
                                                        {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-32">
                                                    <label className="text-xs text-zinc-500 block mb-1">Qty Required</label>
                                                    <input
                                                        type="number" step="0.01"
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-600"
                                                        value={ing.quantity_required} onChange={e => updateIngredient(idx, 'quantity_required', e.target.value)}
                                                    />
                                                </div>
                                                <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black px-8 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">Save Formula</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
