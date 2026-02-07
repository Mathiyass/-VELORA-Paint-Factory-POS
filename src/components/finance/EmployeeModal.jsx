
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({ name: '', role: 'Worker', salary: '', phone: '', email: '', joined_date: new Date().toISOString().split('T')[0] });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            salary: parseFloat(formData.salary)
        });
        setFormData({ name: '', role: 'Worker', salary: '', phone: '', email: '', joined_date: new Date().toISOString().split('T')[0] });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Add New Employee</h2>
                    <button onClick={onClose}><X className="text-zinc-500 hover:text-white transition-colors" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                        <input
                            type="text" required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Role</label>
                            <select
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Worker">Factory Worker</option>
                                <option value="Sales">Sales Staff</option>
                                <option value="Manager">Manager</option>
                                <option value="Driver">Driver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Base Salary (LKR)</label>
                            <input
                                type="number" required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                                value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="07x xxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors placeholder:text-zinc-600"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Joined Date</label>
                        <input
                            type="date"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                            value={formData.joined_date} onChange={e => setFormData({ ...formData, joined_date: e.target.value })}
                        />
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
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
