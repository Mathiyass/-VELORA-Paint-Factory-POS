import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, DollarSign, PieChart, Calendar, TrendingDown } from 'lucide-react';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'General', description: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchExpenses = async () => {
        if (window.api && window.api.getExpenses) {
            setExpenses(await window.api.getExpenses());
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchExpenses();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            await window.api.addExpense({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setShowModal(false);
            setFormData({ title: '', amount: '', category: 'General', description: '' });
            fetchExpenses();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this expense record?')) {
            if (window.api) {
                await window.api.deleteExpense(id);
                fetchExpenses();
            }
        }
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const filteredExpenses = expenses.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <DollarSign className="text-cyan-500" size={32} />
                        Expenses
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Track operational costs and overheads</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                    <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Expenses</h3>
                    <div className="text-3xl font-bold text-white mt-1">LKR {totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-zinc-500 mt-2">All time record</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
                    <h2 className="text-lg font-bold text-white">Expense Records</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all text-white"
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-zinc-900 text-zinc-500 text-sm uppercase font-bold">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {filteredExpenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="p-4 text-zinc-400 font-mono text-xs">{new Date(exp.date).toLocaleDateString()}</td>
                                <td className="p-4 text-white font-medium">
                                    {exp.title}
                                    {exp.description && <div className="text-xs text-zinc-500 font-normal">{exp.description}</div>}
                                </td>
                                <td className="p-4">
                                    <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{exp.category}</span>
                                </td>
                                <td className="p-4 font-bold text-white">LKR {exp.amount.toLocaleString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(exp.id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-zinc-500">No expenses found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Add Expense</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                <input
                                    type="text" required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Amount</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                                    <select
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Salary</option>
                                        <option>Rent</option>
                                        <option>Utilities</option>
                                        <option>Maintenance</option>
                                        <option>Raw Materials (Ad-hoc)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    rows="3"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
                                >
                                    Record Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
