
import React from 'react';
import { X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function ProductModal({
    isOpen,
    isEditing,
    formData,
    onClose,
    onChange,
    onSubmit,
    formulas
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-900/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Product' : 'New Product'}</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Product Name</label>
                            <input required name="name" value={formData.name} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">SKU (Auto if empty)</label>
                            <input name="sku" value={formData.sku} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-mono placeholder:text-zinc-600" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                            <input list="cat-suggestions" name="category" value={formData.category} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                            <datalist id="cat-suggestions">
                                <option value="General" /><option value="Paint" /><option value="Primer" /><option value="Coating" /><option value="Thinner" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Cost Price (LKR)</label>
                            <input type="number" name="price_buy" value={formData.price_buy} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Selling Price (LKR)</label>
                            <input required type="number" name="price_sell" value={formData.price_sell} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Initial Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Warranty Info</label>
                            <input name="warranty" value={formData.warranty} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2"><LinkIcon size={14} /> Link to Manufacturing Formula</label>
                        <select name="formula_id" value={formData.formula_id} onChange={onChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none">
                            <option value="">-- No Formula Linked --</option>
                            {formulas.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                            ))}
                        </select>
                        <p className="text-xs text-zinc-500 mt-1">Linking a formula allows production orders to automatically update this product's stock.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Image URL</label>
                        <div className="flex gap-4">
                            <input name="image" value={formData.image} onChange={onChange} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                            <div className="w-16 h-12 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center overflow-hidden">
                                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="text-zinc-600" />}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all">
                            {isEditing ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
