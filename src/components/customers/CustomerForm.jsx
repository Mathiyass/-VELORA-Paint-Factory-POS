
import React from 'react';
import { UserPlus, User, Phone, Mail, DollarSign } from 'lucide-react';

export default function CustomerForm({ formData, setFormData, handleSubmit, loading }) {
    return (
        <div className="w-1/3 min-w-[350px] bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 flex flex-col shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8 text-cyan-500">
                <UserPlus size={32} />
                <h2 className="text-2xl font-bold tracking-tight text-white">New Customer</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 p-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="tel"
                            placeholder="+1 234 567 890"
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 p-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 p-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Credit Limit (LKR)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                            type="number"
                            placeholder="50000"
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 p-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder:text-zinc-600"
                            value={formData.credit_limit}
                            onChange={e => setFormData({ ...formData, credit_limit: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding...' : 'Add to Database'}
                </button>
            </form>
        </div>
    );
}
