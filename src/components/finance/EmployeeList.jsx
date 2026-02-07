
import { Trash2, Phone, Mail, DollarSign } from 'lucide-react';

export default function EmployeeList({ employees, onDelete }) {
    if (employees.length === 0) {
        return <div className="col-span-full text-center py-20 text-zinc-500">No employees found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees.map(emp => (
                <div key={emp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-cyan-500 border border-zinc-700 shadow-inner">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-100">{emp.name}</h3>
                                <span className="text-xs bg-cyan-950/50 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">{emp.role || 'Staff'}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onDelete(emp.id)}
                            className="text-zinc-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="space-y-3 mt-4 pl-1">
                        {emp.phone && (
                            <div className="flex items-center gap-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                <Phone size={14} className="text-cyan-600" />
                                <span>{emp.phone}</span>
                            </div>
                        )}
                        {emp.email && (
                            <div className="flex items-center gap-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                <Mail size={14} className="text-cyan-600" />
                                <span className="truncate">{emp.email}</span>
                            </div>
                        )}

                        <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 mt-4 flex justify-between items-center group-hover:border-cyan-500/10 transition-colors">
                            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Base Salary</div>
                            <div className="font-bold text-emerald-400 font-mono">LKR {emp.salary?.toLocaleString()}</div>
                        </div>

                        <div className="text-xs text-zinc-600 text-right pt-1 font-mono">
                            Joined: {new Date(emp.joined_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
