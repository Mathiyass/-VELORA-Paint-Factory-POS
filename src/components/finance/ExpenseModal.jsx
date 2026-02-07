
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ExpenseModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'General', description: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
        setFormData({ title: '', amount: '', category: 'General', description: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Add New Expense</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white transition-colors" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
                        <input
                            type="text" required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                            placeholder="e.g. Office Supplies"
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Amount (LKR)</label>
                            <input
                                type="number" required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                                placeholder="0.00"
                                value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
                            <select
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
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
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description (Optional)</label>
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600 resize-none"
                            rows="3"
                            placeholder="Additional details..."
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 hover:scale-105"
                        >
                            Record Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
