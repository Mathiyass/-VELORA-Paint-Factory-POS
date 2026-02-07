
import { Microscope, Trash2 } from 'lucide-react';

export default function FormulaList({ formulas, search, onDelete }) {
    const filtered = formulas.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
        return <div className="col-span-full text-center py-20 text-zinc-500">No formulas defined.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {filtered.map(formula => (
                <div key={formula.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-cyan-950/30 text-cyan-400 rounded-xl flex items-center justify-center text-xl font-bold border border-cyan-500/10">
                            <Microscope size={24} />
                        </div>
                        <button
                            onClick={() => onDelete(formula.id)}
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
        </div>
    );
}
