
import React from 'react';
import { FileText, Printer } from 'lucide-react';

export default function ReportsHeader({ dateRange, setDateRange, handlePrint }) {
    return (
        <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FileText className="text-cyan-500" /> Reports & Analytics
                </h1>
                <p className="text-zinc-500 mt-1">Generate insights for decision making</p>
            </div>
            <div className="flex gap-3">
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-500 text-white"
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                    <option value="365">Last Year</option>
                </select>
                <button onClick={handlePrint} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
                    <Printer size={16} /> Print
                </button>
            </div>
        </div>
    );
}
