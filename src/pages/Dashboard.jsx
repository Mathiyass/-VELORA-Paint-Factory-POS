import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Activity, Factory, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, netProfit: 0, totalSales: 0, activeProduction: 0, lowStockCount: 0 });
  const [activity, setActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  const COLORS = ['#00FFDE', '#FF6B6B', '#06b6d4', '#f87171', '#22d3ee'];

  useEffect(() => {
    const fetchData = async () => {
      if (!window.api) return;
      try {
        const dashboardStats = await window.api.getDashboardStats();
        const recentActivity = await window.api.getRecentActivity();
        const history = await window.api.getTransactions();
        const catData = await window.api.getSalesByCategory();

        setStats(dashboardStats);
        setActivity(recentActivity || []);

        // Transform Category Data for Recharts
        const formattedCatData = (catData || []).map(d => ({
          name: d.name,
          value: d.value
        }));
        setCategoryData(formattedCatData);

        // Process Chart Data (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const data = last7Days.map(date => {
          const dayTotal = (history || [])
            .filter(tx => tx.timestamp.startsWith(date))
            .reduce((sum, tx) => sum + (tx.total_amount || 0), 0);
          return { name: date.slice(5), sales: dayTotal }; // MM-DD
        });
        setChartData(data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };

    fetchData();
  }, []);

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
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>Refresh Data</Button>
          <Button variant="primary" size="sm" icon={ArrowUpRight} onClick={() => navigate('/pos')}>New Sale</Button>
        </div>
      </div>


      {/* Stats Grid */}
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

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sales Chart & Pie Chart */}
        <div className="lg:col-span-2 space-y-8">

          {/* Sales Trend Area Chart */}
          <Card title="Production & Sales Trend" className="h-[400px]">
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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

          {/* Sales by Category Pie Chart */}
          <Card title="Revenue by Category" className="h-[400px]">
            <div className="h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => `LKR ${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
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
      </div>
    </div>
  );
}