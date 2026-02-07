
import { Plus } from 'lucide-react';

export default function ProductionHeader({ title, subtitle, onAction, actionLabel, icon: Icon }) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    {Icon && <Icon className="text-cyan-500" size={32} />}
                    {title}
                </h1>
                <p className="text-zinc-500 mt-1">{subtitle}</p>
            </div>
            {onAction && (
                <button
                    onClick={onAction}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105"
                >
                    <Plus size={20} /> {actionLabel}
                </button>
            )}
        </div>
    );
}
