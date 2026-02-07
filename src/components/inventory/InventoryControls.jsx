
import React from 'react';
import { Search, X } from 'lucide-react';

export default function InventoryControls({
    searchTerm,
    setSearchTerm,
    filterLowStock,
    setFilterLowStock,
    selectedCategory,
    setSelectedCategory,
    categories
}) {
    return (
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                />
            </div>
            <div className="flex gap-2 items-center overflow-x-auto pb-1 custom-scrollbar">
                {filterLowStock && (
                    <button onClick={() => setFilterLowStock(false)} className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-900/30">
                        Low Stock Only <X size={12} />
                    </button>
                )}
                {categories.map(c => (
                    <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${selectedCategory === c ? 'bg-zinc-800 border-cyan-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}
