
import React from 'react';
import { History as HistoryIcon, Search } from 'lucide-react';

export default function HistoryHeader({ transactionCount, searchTerm, onSearchChange }) {
    return (
        <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <HistoryIcon className="text-cyan-500" size={32} />
                    <span>Sales History</span>
                </h1>
                <p className="text-zinc-500 mt-1 font-medium text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    {transactionCount} Records Found
                </p>
            </div>

            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input
                    type="text" placeholder="Search Customer or ID..."
                    value={searchTerm} onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:border-cyan-500 outline-none w-72 text-white placeholder:text-zinc-600 transition-all focus:ring-1 focus:ring-cyan-500"
                />
            </div>
        </header>
    );
}
