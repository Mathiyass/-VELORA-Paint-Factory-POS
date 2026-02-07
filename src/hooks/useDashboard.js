
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const useDashboard = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, netProfit: 0, totalSales: 0, activeProduction: 0, lowStockCount: 0 });
    const [activity, setActivity] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [
                dashboardStats,
                recentActivity,
                history,
                catData,
                smartData
            ] = await Promise.all([
                api.getDashboardStats(),
                api.getRecentActivity(),
                api.getTransactions(),
                api.getSalesByCategory(),
                api.getSmartInsights()
            ]);

            setStats(dashboardStats || {});
            setActivity(recentActivity || []);
            setInsights(smartData);

            // Transform Category Data
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
                    .filter(tx => tx.timestamp && tx.timestamp.startsWith(date))
                    .reduce((sum, tx) => sum + (tx.total || tx.total_amount || 0), 0);
                return { name: date.slice(5), sales: dayTotal }; // MM-DD
            });
            setChartData(data);

        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return {
        stats,
        activity,
        chartData,
        categoryData,
        insights,
        loading,
        refresh: fetchData
    };
};
