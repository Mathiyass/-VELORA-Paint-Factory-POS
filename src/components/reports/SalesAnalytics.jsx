
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportCard from './ReportCard';

export default function SalesAnalytics({ data }) {
    return (
        <>
            <ReportCard title="Revenue Trend">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                                cursor={{ fill: '#27272a', opacity: 0.4 }}
                            />
                            <Legend />
                            <Bar dataKey="sales" name="Total Sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ReportCard>

            <ReportCard title="Transaction Log">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-950 text-zinc-300 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-3 rounded-l-lg">Date</th>
                                <th className="p-3">Sales Volume</th>
                                <th className="p-3">Transactions</th>
                                <th className="p-3 rounded-r-lg text-right">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-3">{row.date}</td>
                                    <td className="p-3 text-white font-medium">LKR {row.sales.toLocaleString()}</td>
                                    <td className="p-3">{row.count}</td>
                                    <td className="p-3 text-right text-emerald-500 font-bold">LKR {row.profit.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ReportCard>
        </>
    );
}
