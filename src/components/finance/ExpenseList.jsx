
import { Trash2 } from 'lucide-react';

export default function ExpenseList({ expenses, onDelete }) {
    if (expenses.length === 0) {
        return <div className="text-center py-20 text-zinc-500 border border-zinc-800 rounded-2xl bg-zinc-900/30">No expenses recorded.</div>;
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-zinc-900/80 text-zinc-500 text-sm uppercase font-bold backdrop-blur-sm">
                    <tr>
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm">
                    {expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors group">
                            <td className="p-4 pl-6 text-zinc-400 font-mono text-xs">{new Date(exp.date).toLocaleDateString()}</td>
                            <td className="p-4 text-white font-medium">
                                {exp.title}
                                {exp.description && <div className="text-xs text-zinc-500 font-normal mt-0.5 max-w-md truncate">{exp.description}</div>}
                            </td>
                            <td className="p-4">
                                <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-700/50">{exp.category}</span>
                            </td>
                            <td className="p-4 font-bold text-white font-mono">LKR {exp.amount.toLocaleString()}</td>
                            <td className="p-4 text-right pr-6">
                                <button
                                    onClick={() => onDelete(exp.id)}
                                    className="text-zinc-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
