
import { CheckCircle, Clock, Play } from 'lucide-react';

export default function OrderList({ orders, onExecute }) {
    if (orders.length === 0) {
        return <div className="col-span-full text-center text-zinc-500 py-10">No production orders found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map(po => {
                const isCompleted = po.status === 'Completed';
                return (
                    <div key={po.id} className={`bg-zinc-900/50 border rounded-2xl p-6 transition-all relative overflow-hidden ${isCompleted ? 'border-zinc-800 opacity-75' : 'border-zinc-700 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]'}`}>
                        {isCompleted && <div className="absolute top-0 right-0 p-4"><CheckCircle className="text-emerald-500" size={24} /></div>}
                        {!isCompleted && <div className="absolute top-0 right-0 p-4"><Clock className="text-amber-500" size={24} /></div>}

                        <div className="mb-4">
                            <span className="text-xs font-mono text-cyan-500 block mb-1">BATCH #{po.batch_code || `PO-${po.id}`}</span>
                            <h3 className="text-xl font-bold text-white mb-1">{po.formula_name}</h3>
                            <p className="text-sm text-zinc-400">Yield: {po.product_name || 'Generic Output'}</p>
                        </div>

                        <div className="flex justify-between items-center bg-zinc-950/50 rounded-xl p-4 mb-4 border border-zinc-900">
                            <div>
                                <div className="text-xs text-zinc-500 uppercase">Planned</div>
                                <div className="text-lg font-bold text-white">{po.quantity_planned} Units</div>
                            </div>
                            {isCompleted && (
                                <div className="text-right">
                                    <div className="text-xs text-zinc-500 uppercase">Produced</div>
                                    <div className="text-lg font-bold text-emerald-400">{po.quantity_produced} Units</div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-xs text-zinc-500">
                                {new Date(po.created_at).toLocaleDateString()}
                            </div>
                            {!isCompleted && (
                                <button
                                    onClick={() => onExecute(po.id)}
                                    className="bg-zinc-800 hover:bg-cyan-600 hover:text-black text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                >
                                    <Play size={14} /> Execute Run
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
