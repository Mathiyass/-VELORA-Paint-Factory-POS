
import React from 'react';
import ReportCard from './ReportCard';

export default function StockAlerts({ data }) {
    return (
        <ReportCard title="Critical Stock Levels">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950 text-zinc-300 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-3 rounded-l-lg">Item Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3 text-center">Current Stock</th>
                            <th className="p-3 text-center">Reorder Level</th>
                            <th className="p-3 rounded-r-lg text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-zinc-500">All stock levels are healthy.</td></tr>
                        ) : data.map((row, i) => (
                            <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                <td className="p-3 font-medium text-white">{row.name}</td>
                                <td className="p-3">{row.type}</td>
                                <td className="p-3 text-center text-red-500 font-bold">{row.current}</td>
                                <td className="p-3 text-center text-zinc-500">{row.min}</td>
                                <td className="p-3 text-right">
                                    <span className="bg-red-900/20 text-red-500 px-2 py-1 rounded text-xs font-bold uppercase border border-red-900/40">
                                        Low Stock
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ReportCard>
    );
}
