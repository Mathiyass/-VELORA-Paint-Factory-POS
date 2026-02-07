
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useDashboard } from '../hooks/useDashboard';
import StatsGrid from '../components/dashboard/StatsGrid';
import InsightsBanner from '../components/dashboard/InsightsBanner';
import SalesChart from '../components/dashboard/SalesChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const { stats, activity, chartData, categoryData, insights, refresh } = useDashboard();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-[var(--color-bg-app)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            Factory Overview
          </h1>
          <p className="text-zinc-500 mt-1">Real-time production and sales metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={refresh}>Refresh Data</Button>
          <Button variant="primary" size="sm" icon={ArrowUpRight} onClick={() => navigate('/pos')}>New Sale</Button>
        </div>
      </div>

      <StatsGrid stats={stats} containerVariants={containerVariants} itemVariants={itemVariants} />

      <InsightsBanner insights={insights} itemVariants={itemVariants} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SalesChart data={chartData} />
          <CategoryChart data={categoryData} />
        </div>
        <RecentActivity activity={activity} />
      </div>
    </div>
  );
}