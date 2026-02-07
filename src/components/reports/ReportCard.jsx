
import React from 'react';

export default function ReportCard({ title, children }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            {children}
        </div>
    );
}
