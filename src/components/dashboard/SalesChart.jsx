
import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

export default function SalesChart({ data }) {
    return (
        <Card title="Production & Sales Trend" className="h-[400px]">
            <div className="h-full pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FFDE" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00FFDE" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                            itemStyle={{ color: '#00FFDE' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#00FFDE" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
