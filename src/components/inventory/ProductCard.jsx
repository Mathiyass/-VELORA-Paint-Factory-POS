
import React from 'react';
import { Image as ImageIcon, Edit, AlertTriangle, Trash2, FlaskConical } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete }) {
    const hasFormula = !!product.formula_id;
    const profit = product.price_sell - product.price_buy;
    const isLow = product.stock < 10;

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group relative overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} /> : <ImageIcon className="text-zinc-700" size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-zinc-100 truncate pr-2">{product.name}</h3>
                        {hasFormula && <FlaskConical className="text-fuchsia-500 shrink-0" size={18} title="Linked to Formula" />}
                    </div>
                    <div className="text-xs font-mono text-zinc-500 mb-2">{product.sku}</div>
                    <div className="flex gap-2 text-xs">
                        <span className="bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{product.category}</span>
                        {product.warranty && <span className="bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{product.warranty}</span>}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                <div>
                    <div className="text-xs text-zinc-500 uppercase font-bold">Selling Price</div>
                    <div className="text-lg font-bold text-cyan-400">LKR {product.price_sell.toLocaleString()}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-zinc-500 uppercase font-bold">Stock Level</div>
                    <div className={`text-lg font-bold flex items-center justify-end gap-1 ${isLow ? 'text-red-500' : 'text-emerald-400'}`}>
                        {isLow && <AlertTriangle size={14} />} {product.stock}
                    </div>
                </div>
            </div>

            <div className="mt-3 flex justify-between items-center text-xs text-zinc-500 px-1">
                <span>Cost: LKR {product.price_buy.toLocaleString()}</span>
                <span>Margin: <span className="text-zinc-300">+{profit.toLocaleString()}</span></span>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => onEdit(product)} className="p-2 bg-zinc-800 hover:bg-cyan-900 text-white rounded-lg shadow-lg border border-zinc-700 hover:border-cyan-500 transition-colors"><Edit size={14} /></button>
                <button onClick={() => onDelete(product.id)} className="p-2 bg-zinc-800 hover:bg-red-900 text-white rounded-lg shadow-lg border border-zinc-700 hover:border-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
        </div>
    );
}
