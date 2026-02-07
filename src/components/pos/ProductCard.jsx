
import React from 'react';
import { LayoutGrid, Package } from 'lucide-react';

export default function ProductCard({ product, onAdd }) {
    const isLowStock = product.stock < 5;
    const isOutOfStock = product.stock <= 0;

    return (
        <button
            onClick={() => onAdd(product)}
            disabled={isOutOfStock}
            className={`text-left bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 
                ${isOutOfStock ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-xl hover:-translate-y-1'}
            `}
        >
            <div className="aspect-video bg-zinc-950 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={product.name}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
                        <Package size={36} className="group-hover:text-cyan-600/50 transition-colors" />
                    </div>
                )}
                {/* Stock Badge */}
                <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors
                    ${isLowStock
                        ? 'bg-red-900/90 text-red-200 border border-red-700/50 shadow-red-500/20 shadow-lg'
                        : 'bg-black/70 text-cyan-400 border border-zinc-700/50'
                    }`}>
                    {isOutOfStock ? 'OUT OF STOCK' : `Stock: ${product.stock}`}
                </span>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-cyan-400 font-bold text-lg">LKR {product.price_sell.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 font-medium">{product.category}</span>
                </div>
            </div>
        </button>
    );
}

