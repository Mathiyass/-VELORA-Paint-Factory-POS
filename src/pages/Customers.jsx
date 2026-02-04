import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trophy, Mail, Phone, User, Trash2, History, X, DollarSign } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Customers() {
  const { success, error } = useToast();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', credit_limit: '' });
  const [loading, setLoading] = useState(false);

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);

  const loadCustomers = async () => {
    try {
      if (window.api) {
        const data = await window.api.getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load customers", error);
    }
  };

  useEffect(() => {
    loadCustomers();
     
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    try {
      await window.api.addCustomer({
        ...formData,
        credit_limit: parseFloat(formData.credit_limit) || 0
      });
      setFormData({ name: '', phone: '', email: '', credit_limit: '' });
      await loadCustomers();
      success("Customer added successfully");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer? This cannot be undone.")) return;
    try {
      await window.api.deleteCustomer(id);
      loadCustomers();
      success("Customer deleted");
    } catch {
      error("Failed to delete customer");
    }
  };

  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const history = await window.api.getCustomerHistory(customer.id);
      setCustomerHistory(history);
      setHistoryModalOpen(true);
    } catch (e) {
      console.error(e);
      error("Failed to load history");
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="h-full flex gap-6 p-8 overflow-hidden bg-[var(--color-bg-app)] text-zinc-100 relative font-sans">

      {/* Left: Add Form */}
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

      {/* Right: List */}
      <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/80 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Loyalty & CRM</h2>
              <p className="text-xs text-zinc-500">Manage customer relationships and credit</p>
            </div>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-9 py-2.5 text-sm focus:border-cyan-600 outline-none text-white focus:ring-1 focus:ring-cyan-600"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {filteredCustomers.length === 0 ? (
            <div className="text-center text-zinc-500 mt-20">No customers found</div>
          ) : (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl flex justify-between items-center transition-all hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 text-lg">{customer.name}</h3>
                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                      {customer.phone && <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors"><Phone size={12} /> {customer.phone}</span>}
                      {customer.email && <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors"><Mail size={12} /> {customer.email}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleViewHistory(customer)} className="text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors" title="View History"><History size={16} /></button>
                    <button onClick={() => handleDelete(customer.id)} className="text-zinc-500 hover:text-red-400 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Points</span>
                    <div className="bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 text-cyan-400 font-mono font-bold shadow-inner border-cyan-500/20">
                      {customer.points || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History Modal */}
      {historyModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200 shadow-cyan-900/10">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-xl">
              <div>
                <h3 className="font-bold text-white text-lg">Purchase History</h3>
                <p className="text-zinc-500 text-sm font-mono">{selectedCustomer?.name}</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-zinc-950/50">
              {customerHistory.length === 0 ? <p className="text-zinc-500 text-center py-10">No purchase history found.</p> :
                customerHistory.map(tx => (
                  <div key={tx.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs font-bold font-mono">#{tx.id}</span>
                        <span className="text-zinc-500 text-xs">{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tx.payment_method === 'Split' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900'}`}>
                        {JSON.stringify(tx.payment_method).includes('[') ? 'Split' : tx.payment_method}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {tx.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-zinc-400">
                          <span className="flex items-center gap-2">
                            <span className="text-zinc-600 font-mono text-xs">x{item.quantity}</span>
                            {item.name}
                          </span>
                          <span className="font-mono text-zinc-500">{item.price_sell.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-white items-center">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Total</span>
                      <span className="text-lg text-cyan-400">LKR {tx.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

    </div>
  );
}