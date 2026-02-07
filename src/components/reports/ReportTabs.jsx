
import React from 'react';
import { TrendingUp, Factory, Package } from 'lucide-react';

export default function ReportTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'sales', label: 'Sales Performance', icon: TrendingUp },
        { id: 'production', label: 'Factory Output', icon: Factory },
        { id: 'stock', label: 'Low Stock Alerts', icon: Package },
    ];

    return (
        <div className="flex gap-4 border-b border-zinc-800 mb-6 shrink-0">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold transition-colors border-b-2 ${activeTab === tab.id
                        ? 'text-cyan-500 border-cyan-500'
                        : 'text-zinc-500 border-transparent hover:text-zinc-300'
                        }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
    );
}
