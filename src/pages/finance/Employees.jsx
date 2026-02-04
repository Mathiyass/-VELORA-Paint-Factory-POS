import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Users, Phone, Mail, Calendar, DollarSign, Briefcase } from 'lucide-react';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: 'Worker', salary: '', phone: '', email: '', joined_date: new Date().toISOString().split('T')[0] });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmployees = async () => {
        if (window.api && window.api.getEmployees) {
            setEmployees(await window.api.getEmployees());
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmployees();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            await window.api.addEmployee({
                ...formData,
                salary: parseFloat(formData.salary)
            });
            setShowModal(false);
            setFormData({ name: '', role: 'Worker', salary: '', phone: '', email: '', joined_date: new Date().toISOString().split('T')[0] });
            fetchEmployees();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Remove this employee?')) {
            if (window.api) {
                await window.api.deleteEmployee(id);
                fetchEmployees();
            }
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="text-cyan-500" size={32} />
                        HR & Employees
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage staff details and payroll configuration</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEmployees.map(emp => (
                    <div key={emp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-cyan-500 border border-zinc-700">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-100">{emp.name}</h3>
                                    <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900/50">{emp.pos_role}</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(emp.id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>

                        <div className="space-y-3 mt-4">
                            {emp.phone && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <Phone size={14} className="text-cyan-600" />
                                    <span>{emp.phone}</span>
                                </div>
                            )}
                            {emp.email && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <Mail size={14} className="text-cyan-600" />
                                    <span className="truncate">{emp.email}</span>
                                </div>
                            )}

                            <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-900 mt-4 flex justify-between items-center">
                                <div className="text-xs text-zinc-500">
                                    <DollarSign size={14} className="inline mb-0.5" /> Base Salary
                                </div>
                                <div className="font-bold text-emerald-400">LKR {emp.salary?.toLocaleString()}</div>
                            </div>
                            <div className="text-xs text-zinc-600 text-right">
                                Joined: {new Date(emp.joined_date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Add New Employee</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Role</label>
                                    <select
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
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
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Base Salary</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Joined Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.joined_date} onChange={e => setFormData({ ...formData, joined_date: e.target.value })}
                                />
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
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
