
import React from 'react';
import { Package, Plus, UploadCloud } from 'lucide-react';

export default function InventoryHeader({ onImport, onAdd }) {
    return (
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white tracking-tight">
                    <Package className="text-cyan-500" size={32} />
                    Inventory Management
                </h1>
                <p className="text-zinc-500 mt-1">Manage products, pricing, and manufacturing links</p>
            </div>
            <div className="flex gap-3">
                <button onClick={onImport} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <UploadCloud size={18} /> Import CSV
                </button>
                <button onClick={onAdd} className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold transition-colors">
                    <Plus size={18} /> Add Product
                </button>
            </div>
        </div>
    );
}
