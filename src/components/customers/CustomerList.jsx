
import React from 'react';
import { Trophy, Search, Phone, Mail, History, Trash2 } from 'lucide-react';

export default function CustomerList({ customers, search, setSearch, handleViewHistory, handleDelete }) {
    return (
        <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/80 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Loyalty & CRM</h2>
                        <p className="text-xs text-zinc-500">Manage customer relationships and credit</p>
                    </div>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-9 py-2.5 text-sm focus:border-cyan-600 outline-none text-white focus:ring-1 focus:ring-cyan-600"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {customers.length === 0 ? (
                    <div className="text-center text-zinc-500 mt-20">No customers found</div>
                ) : (
                    customers.map(customer => (
                        <div key={customer.id} className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl flex justify-between items-center transition-all hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-lg">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-200 text-lg">{customer.name}</h3>
                                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                                        {customer.phone && <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors"><Phone size={12} /> {customer.phone}</span>}
                                        {customer.email && <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors"><Mail size={12} /> {customer.email}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleViewHistory(customer)} className="text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors" title="View History"><History size={16} /></button>
                                    <button onClick={() => handleDelete(customer.id)} className="text-zinc-500 hover:text-red-400 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Points</span>
                                    <div className="bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 text-cyan-400 font-mono font-bold shadow-inner border-cyan-500/20">
                                        {customer.points || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
