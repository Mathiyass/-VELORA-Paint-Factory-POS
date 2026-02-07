
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export default function RecentActivity({ activity }) {
    return (
        <Card title="Live Factory Feed" className="h-fit sticky top-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {activity.length === 0 ? (
                    <div className="text-zinc-500 text-sm text-center py-10">No recent activity.</div>
                ) : activity.map((tx, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl bg-zinc-950/50 border border-zinc-900 hover:border-zinc-800 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 font-bold text-sm">
                            #{tx.id}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-zinc-200 font-medium truncate">{tx.customer_name || 'Walk-in'}</div>
                            <div className="text-xs text-zinc-500">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-emerald-400 font-bold text-sm">+{tx.total_amount?.toLocaleString()}</div>
                            <Badge variant="default" className="scale-90 origin-right">{tx.status}</Badge>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
}
