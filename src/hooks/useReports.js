
import { useState, useEffect, useMemo, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useReports = () => {
    const { error, info } = useToast();
    const [activeTab, setActiveTab] = useState('sales');
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365
    const [data, setData] = useState({ transactions: [], production: [], chemicals: [], products: [] });
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [txs, prod, chems, prods] = await Promise.all([
                api.getTransactions(),
                api.getProductionOrders(),
                api.getChemicals(),
                api.getProducts()
            ]);
            setData({ transactions: txs || [], production: prod || [], chemicals: chems || [], products: prods || [] });
        } catch (e) {
            console.error("Failed to load report data", e);
            error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const reportData = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - parseInt(dateRange));

        if (activeTab === 'sales') {
            const filtered = data.transactions.filter(t => new Date(t.timestamp) >= cutoff);
            // Group by Date
            const grouped = {};
            filtered.forEach(t => {
                const date = t.timestamp.split('T')[0];
                if (!grouped[date]) grouped[date] = { date, sales: 0, profit: 0, count: 0 };
                grouped[date].sales += t.total_amount;
                grouped[date].profit += t.net_profit || 0;
                grouped[date].count += 1;
            });
            return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
        }
        else if (activeTab === 'production') {
            const filtered = data.production.filter(p => new Date(p.created_at) >= cutoff);
            const grouped = {};
            filtered.forEach(p => {
                const date = p.created_at.split('T')[0];
                if (!grouped[date]) grouped[date] = { date, planned: 0, completed: 0 };
                grouped[date].planned += p.quantity_planned;
                if (p.status === 'Completed') grouped[date].completed += p.quantity_planned;
            });
            return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
        }
        else if (activeTab === 'stock') {
            // Stock isn't time-series usually, it's snapshot.
            // We'll just show current low stock items.
            const lowChem = data.chemicals.filter(c => c.current_stock <= c.reorder_level).map(c => ({ name: c.name, type: 'Chemical', current: c.current_stock, min: c.reorder_level }));
            const lowProd = data.products.filter(p => p.stock < 5).map(p => ({ name: p.name, type: 'Product', current: p.stock, min: 5 }));
            return [...lowChem, ...lowProd];
        }
        return [];
    }, [data, activeTab, dateRange]);

    const handlePrint = () => {
        info("Preparing print view...");
        setTimeout(() => window.print(), 500);
    };

    return {
        activeTab,
        dateRange,
        reportData,
        loading,
        actions: {
            setActiveTab,
            setDateRange,
            handlePrint,
            refresh: loadData
        }
    };
};
