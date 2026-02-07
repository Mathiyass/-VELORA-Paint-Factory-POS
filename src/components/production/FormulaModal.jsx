
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from '../Modal'; // Assuming generic modal exists, or we might need one in this dir

// Re-using the Modal component from parent directory as seen in original code
// import Modal from '../../components/Modal'; 
// But since we are inside components/production, it would be ../../components/Modal if it exists there
// Let's check where Modal is. Original code: import Modal from '../../components/Modal'; in Formulas.jsx
// So it is at src/components/Modal.jsx

const ModalComponent = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-900/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default function FormulaModal({ isOpen, onClose, onCreate, chemicals, products }) {
    const [newFormula, setNewFormula] = useState({
        name: '',
        description: '',
        yield_quantity: 1,
        product_id: '',
        ingredients: []
    });

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

    const handleSubmit = () => {
        if (!newFormula.name || newFormula.ingredients.length === 0) {
            alert("Name and at least one ingredient required.");
            return;
        }
        onCreate(newFormula);
        setNewFormula({ name: '', description: '', yield_quantity: 1, product_id: '', ingredients: [] });
        onClose();
    };

    const calculateCost = () => {
        return newFormula.ingredients.reduce((total, ing) => {
            const chem = chemicals.find(c => c.id === ing.chemical_id);
            const cost = chem ? (chem.avg_cost || 0) : 0;
            return total + (ing.quantity_required * cost);
        }, 0);
    };

    return (
        <ModalComponent isOpen={isOpen} onClose={onClose} title="Create Production Formula">
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

                <div className="border-t border-zinc-800 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Ingredients</h3>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-emerald-400">
                                Est. Cost: LKR {calculateCost().toLocaleString()}
                            </span>
                            <button onClick={addIngredient} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                <Plus size={14} /> Add Material
                            </button>
                        </div>
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
                                        {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.unit}) - LKR {c.avg_cost?.toFixed(2)}</option>)}
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
                    <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 hover:from-cyan-500 hover:to-blue-500 transition-all">Save Formula</button>
                </div>
            </div>
        </ModalComponent>
    );
}
