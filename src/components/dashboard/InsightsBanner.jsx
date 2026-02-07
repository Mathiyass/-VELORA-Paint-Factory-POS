
import React from 'react';
import { Activity } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export default function InsightsBanner({ insights, itemVariants }) {
    if (!insights) return null;

    return (
        <motion.div variants={itemVariants} className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-zinc-900 to-zinc-950 border-cyan-500/20">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                        <Activity size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            AI Smart Insights
                            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">Beta</Badge>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Trending */}
                            <div>
                                <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Trending Products</div>
                                <ul className="space-y-1">
                                    {insights.trending.map((t, i) => (
                                        <li key={i} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">{i + 1}. {t.name}</span>
                                            <span className="text-cyan-500 font-bold">{t.qty} Sold</span>
                                        </li>
                                    ))}
                                    {insights.trending.length === 0 && <li className="text-zinc-500 text-sm">Not enough data</li>}
                                </ul>
                            </div>

                            {/* Stock Alerts */}
                            <div>
                                <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Critical Alerts</div>
                                {insights.lowStock.length === 0 ? <div className="text-emerald-500 text-sm">All Stock Levels Optimal</div> : (
                                    <ul className="space-y-1">
                                        {insights.lowStock.slice(0, 3).map((s, i) => (
                                            <li key={i} className="flex justify-between text-sm">
                                                <span className="text-zinc-300">{s.name}</span>
                                                <span className="text-red-400 font-bold">{s.stock} {s.type === 'Chemical' ? 'kg' : 'units'}</span>
                                            </li>
                                        ))}
                                        {insights.lowStock.length > 3 && <li className="text-xs text-zinc-500">+{insights.lowStock.length - 3} more...</li>}
                                    </ul>
                                )}
                            </div>

                            {/* Performance */}
                            <div>
                                <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Performance</div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    LKR {insights.performance.today.toLocaleString()}
                                </div>
                                <div className={`text-sm font-medium ${insights.performance.status === 'Trending Up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {insights.performance.status} vs 7-day Avg
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
