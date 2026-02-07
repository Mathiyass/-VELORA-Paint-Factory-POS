
import React from 'react';
import { DollarSign, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { StatCard } from '../ui/StatCard';
import { useNavigate } from 'react-router-dom';

export default function StatsGrid({ stats, containerVariants, itemVariants }) {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <motion.div variants={itemVariants}>
                <StatCard
                    title="Daily Revenue"
                    value={`LKR ${stats.totalRevenue?.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-cyan-600"
                    subtext="Today's Sales"
                    trend={12} // Mock trend
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <StatCard
                    title="Net Profit"
                    value={`LKR ${stats.netProfit?.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-blue-600"
                    subtext="Real-time Margin"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <StatCard
                    title="Production Queue"
                    value={stats.activeProduction}
                    icon={Activity}
                    color="bg-violet-600"
                    subtext="Jobs In Progress"
                    onClick={() => navigate('/production/orders')}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <StatCard
                    title="Critical Stock"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtext="Items below min level"
                    onClick={() => navigate('/stock?filter=low')}
                />
            </motion.div>
        </motion.div>
    );
}
