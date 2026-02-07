
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportCard from './ReportCard';

export default function ProductionAnalytics({ data }) {
    return (
        <ReportCard title="Production Output vs Plan">
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="planned" name="Planned Qty" stroke="#f59e0b" strokeWidth={3} />
                        <Line type="monotone" dataKey="completed" name="Actual Completed" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ReportCard>
    );
}
