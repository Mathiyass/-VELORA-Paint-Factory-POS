import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Printer, Download, Filter, TrendingUp, Package, Factory, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '../context/ToastContext';

const ReportCard = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
    {children}
  </div>
);

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365
  const [data, setData] = useState({ transactions: [], production: [], chemicals: [], products: [], topProducts: [], categorySales: [] });
  const [reportData, setReportData] = useState([]);
  const { error, info } = useToast();

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!window.api) return;
        const [txs, prod, chems, prods, top, cats] = await Promise.all([
          window.api.getTransactions(),
          window.api.getProductionOrders(),
          window.api.getChemicals(),
          window.api.getProducts(),
          window.api.getTopProducts(),
          window.api.getSalesByCategory()
        ]);
        setData({ transactions: txs, production: prod, chemicals: chems, products: prods, topProducts: top, categorySales: cats });
      } catch (e) {
        error("Failed to load report data");
        console.error(e);
      }
    };
    loadData();
  }, [error]);

  useEffect(() => {
    const processData = () => {
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
        setReportData(Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)));
      }
      else if (activeTab === 'analytics') {
         // Analytics tab uses direct data from API for now, no date filtering implemented on those endpoints yet
         // but we can just pass through
         setReportData({ top: data.topProducts, cats: data.categorySales });
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
        setReportData(Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)));
      }
      else if (activeTab === 'stock') {
        // Stock isn't time-series usually, it's snapshot.
        // We'll just show current low stock items.
        const lowChem = data.chemicals.filter(c => c.current_stock <= c.reorder_level).map(c => ({ name: c.name, type: 'Chemical', current: c.current_stock, min: c.reorder_level }));
        const lowProd = data.products.filter(p => p.stock < 5).map(p => ({ name: p.name, type: 'Product', current: p.stock, min: 5 }));
        setReportData([...lowChem, ...lowProd]);
      }
    };
    processData();
  }, [data, activeTab, dateRange]);

  const handlePrint = () => {
    info("Preparing print view...");
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-app)] text-zinc-100 p-6 overflow-hidden font-sans">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-cyan-500" /> Reports & Analytics
          </h1>
          <p className="text-zinc-500 mt-1">Generate insights for decision making</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </select>
          <button onClick={() => {
            if (!reportData || reportData.length === 0) return error("No data to export");
            const headers = Object.keys(reportData[0] || {}).join(',');
            const rows = (Array.isArray(reportData) ? reportData : []).map(row => Object.values(row).join(',')).join('\n');
            const csv = `${headers}\n${rows}`;
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            info("Exporting CSV...");
          }} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
            <Download size={16} /> Export
          </button>
          <button onClick={handlePrint} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800 mb-6 shrink-0">
        {[
          { id: 'sales', label: 'Sales Performance', icon: TrendingUp },
          { id: 'analytics', label: 'Product Analytics', icon: PieChartIcon },
          { id: 'production', label: 'Factory Output', icon: Factory },
          { id: 'stock', label: 'Low Stock Alerts', icon: Package },
        ].map(tab => (
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">

        {activeTab === 'sales' && (
          <>
            <ReportCard title="Revenue Trend">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Total Sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportCard>

            <ReportCard title="Transaction Log">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-300 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-3 rounded-l-lg">Date</th>
                      <th className="p-3">Sales Volume</th>
                      <th className="p-3">Transactions</th>
                      <th className="p-3 rounded-r-lg text-right">Net Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                        <td className="p-3">{row.date}</td>
                        <td className="p-3 text-white font-medium">LKR {row.sales.toLocaleString()}</td>
                        <td className="p-3">{row.count}</td>
                        <td className="p-3 text-right text-emerald-500 font-bold">LKR {row.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Top Selling Products">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={reportData.top || []} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" stroke="#71717a" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
                    <Bar dataKey="qty" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportCard>

            <ReportCard title="Sales by Category">
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.cats || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(reportData.cats || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ReportCard>
          </div>
        )}

        {activeTab === 'production' && (
          <>
            <ReportCard title="Production Output vs Plan">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
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
          </>
        )}

        {activeTab === 'stock' && (
          <ReportCard title="Critical Stock Levels">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-300 uppercase font-bold text-xs">
                  <tr>
                    <th className="p-3 rounded-l-lg">Item Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-center">Current Stock</th>
                    <th className="p-3 text-center">Reorder Level</th>
                    <th className="p-3 rounded-r-lg text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-zinc-500">All stock levels are healthy.</td></tr>
                  ) : reportData.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3 font-medium text-white">{row.name}</td>
                      <td className="p-3">{row.type}</td>
                      <td className="p-3 text-center text-red-500 font-bold">{row.current}</td>
                      <td className="p-3 text-center text-zinc-500">{row.min}</td>
                      <td className="p-3 text-right">
                        <span className="bg-red-900/20 text-red-500 px-2 py-1 rounded text-xs font-bold uppercase border border-red-900/40">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>
        )}

      </div>

      {/* Print Footer (Only visible when printing) */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center text-xs text-black p-4 bg-white">
        Generated by VELORA POS System on {new Date().toLocaleString()}
      </div>
    </div>
  );
}
