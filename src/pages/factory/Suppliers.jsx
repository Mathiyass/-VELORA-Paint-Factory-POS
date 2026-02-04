import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Phone, Mail, MapPin, Star, Truck } from 'lucide-react';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', email: '', phone: '', address: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSuppliers = async () => {
        if (window.api) {
            const data = await window.api.getSuppliers();
            setSuppliers(data);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSuppliers();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            await window.api.addSupplier(formData);
            setShowModal(false);
            setFormData({ name: '', contact: '', email: '', phone: '', address: '' });
            fetchSuppliers();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            if (window.api) {
                await window.api.deleteSupplier(id);
                fetchSuppliers();
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-zinc-100 p-8 overflow-y-auto custom-scrollbar font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Truck className="text-cyan-500" size={32} />
                        Supplier Management
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage raw material sources and vendor ratings</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> Add Supplier
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSuppliers.map(supplier => (
                    <div key={supplier.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden shadow-lg hover:shadow-cyan-900/10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-600/10 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-300">
                                {supplier.name.charAt(0)}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(supplier.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-zinc-100 mb-1">{supplier.name}</h3>
                        <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium mb-4">
                            <Star size={14} fill="currentColor" />
                            <span>{supplier.rating || '5.0'} Rating</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-zinc-400">
                                <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-800">
                                    <span className="font-bold text-xs">CP</span>
                                </div>
                                <span className="text-zinc-300">{supplier.contact_person || 'N/A'}</span>
                            </div>

                            {supplier.phone && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-800">
                                        <Phone size={14} />
                                    </div>
                                    <span>{supplier.phone}</span>
                                </div>
                            )}

                            {supplier.email && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-800">
                                        <Mail size={14} />
                                    </div>
                                    <span className="truncate">{supplier.email}</span>
                                </div>
                            )}

                            {supplier.address && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 border border-zinc-800">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="truncate">{supplier.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl shadow-cyan-900/20">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Add New Supplier</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.contact}
                                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Address</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    rows="3"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
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
                                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20"
                                >
                                    Add Supplier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
