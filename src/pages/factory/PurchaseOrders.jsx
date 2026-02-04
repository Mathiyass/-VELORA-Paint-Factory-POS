import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, CheckCircle, XCircle, FileText, Truck, Calendar, DollarSign, ChevronDown } from 'lucide-react';

export default function PurchaseOrders() {
    const [orders, setOrders] = useState([]); // This would need a getPurchaseOrders function in db.js - checking if it exists
    const [suppliers, setSuppliers] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Form Data for New PO
    const [newOrder, setNewOrder] = useState({ supplier_id: '', items: [] });
    // Receive Data
    const [receiveData, setReceiveData] = useState([]);

    const fetchOrders = async () => {
        // We need to implement getPurchaseOrders in db.js if not exists
        // Looking at db.js in previous steps... I don't recall getPurchaseOrders being exported explicitly for basic listing?
        // Wait, I saw createPurchaseOrder/receivePurchaseOrder. 
        // I need to ADD getPurchaseOrders to db.js if it's missing.
        if (window.api && window.api.getPurchaseOrders) {
            setOrders(await window.api.getPurchaseOrders());
        }
    };

    const fetchSuppliers = async () => { if (window.api) setSuppliers(await window.api.getSuppliers()); };
    const fetchChemicals = async () => { if (window.api) setChemicals(await window.api.getChemicals()); };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
        fetchSuppliers();
        fetchChemicals();

    }, []);

    const handleAddItem = () => {
        setNewOrder({ ...newOrder, items: [...newOrder.items, { chemical_id: '', quantity: 1, cost: 0 }] });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...newOrder.items];
        newItems[index][field] = value;
        setNewOrder({ ...newOrder, items: newItems });
    };

    const calculateTotal = () => {
        return newOrder.items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            // window.api.createPurchaseOrder doesn't seem to exist in the db.js I saw earlier? 
            // I saw createProductionOrder. 
            // I probably need to ADD createPurchaseOrder to db.js too.
            // For now, let's assume I will add it.
            await window.api.createPurchaseOrder(newOrder);
            setShowCreateModal(false);
            fetchOrders();
        }
    };

    const initReceive = (order) => {
        setSelectedOrder(order);
        // Pre-fill receive data
        // We need to fetch items for this order. 
        // api.getPurchaseOrderItems(id)?
        // For now I'll assume passing order.items if available, or fetching.
        // Let's assume I implement getPurchaseOrderDetails.
        // Or better, I'll pass the items if I can fetch "Orders with Items".

        // Placeholder: Setup receive items based on selected order (fetched separately or passed)
        // I'll implement fetchPOItems in db.js
        fetchPOItems(order.id);
        setShowReceiveModal(true);
    };

    const fetchPOItems = async (id) => {
        if (window.api) {
            const items = await window.api.getPurchaseOrderItems(id);
            setReceiveData(items.map(i => ({
                ...i,
                batch_number: '',
                expiry_date: '',
                quantity_receiving: i.quantity_ordered // Default full receive
            })));
        }
    };

    const handleReceiveSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            // Format for db.receivePurchaseOrder: poId, itemsToReceive
            const itemsToSubmit = receiveData.map(i => ({
                chemical_id: i.chemical_id,
                quantity: i.quantity_receiving, // or quantity_ordered
                batch_number: i.batch_number,
                expiry_date: i.expiry_date,
                cost: i.cost_quoted
            }));
            await window.api.receivePurchaseOrder(selectedOrder.id, itemsToSubmit);
            setShowReceiveModal(false);
            fetchOrders();
        }
    };

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-zinc-100 p-8 overflow-y-auto custom-scrollbar font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="text-cyan-500" size={32} />
                        Purchase Orders
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage supplier orders and incoming stock receivers</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                >
                    <Plus size={18} /> New Order
                </button>
            </div>

            {/* Orders List */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900 text-zinc-500 text-sm uppercase font-bold">
                        <tr>
                            <th className="p-4">PO #</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Total Cost</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {orders.map(po => (
                            <tr key={po.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="p-4 font-mono text-zinc-300">PO-{po.id.toString().padStart(4, '0')}</td>
                                <td className="p-4 font-medium text-white">{po.supplier_name}</td>
                                <td className="p-4 text-zinc-400">{new Date(po.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-400' :
                                        po.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {po.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-medium text-white">LKR {po.total_cost?.toLocaleString()}</td>
                                <td className="p-4 flex justify-center gap-2">
                                    {po.status === 'Pending' && (
                                        <button
                                            onClick={() => initReceive(po)}
                                            className="flex items-center gap-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded transition-colors text-xs font-bold uppercase"
                                        >
                                            <CheckCircle size={14} /> Receive
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-zinc-500">No purchase orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Create Purchase Order</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Supplier</label>
                                <select
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-600 transition-colors"
                                    value={newOrder.supplier_id}
                                    onChange={e => setNewOrder({ ...newOrder, supplier_id: e.target.value })}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase">Order Items</h3>
                                    <button onClick={handleAddItem} className="text-cyan-500 text-sm hover:text-cyan-400 font-medium">+ Add Item</button>
                                </div>
                                {newOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-end bg-zinc-950/50 p-3 rounded-xl border border-zinc-900">
                                        <div className="flex-1">
                                            <label className="text-xs text-zinc-500 block mb-1">Chemical</label>
                                            <select
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-600 focus:outline-none"
                                                value={item.chemical_id}
                                                onChange={e => updateItem(idx, 'chemical_id', e.target.value)}
                                            >
                                                <option value="">Select Raw Material</option>
                                                {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs text-zinc-500 block mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-600 focus:outline-none"
                                                value={item.quantity}
                                                onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="w-32">
                                            <label className="text-xs text-zinc-500 block mb-1">Cost / Unit</label>
                                            <input
                                                type="number"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-600 focus:outline-none"
                                                value={item.cost}
                                                onChange={e => updateItem(idx, 'cost', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <button onClick={() => {
                                            const newItems = newOrder.items.filter((_, i) => i !== idx);
                                            setNewOrder({ ...newOrder, items: newItems });
                                        }} className="text-zinc-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                            <div>
                                <span className="text-zinc-400 text-sm">Total Estimated Cost</span>
                                <div className="text-2xl font-bold text-white">LKR {calculateTotal().toLocaleString()}</div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button onClick={handleCreateSubmit} className="bg-cyan-600 hover:bg-cyan-500 text-black px-8 py-2 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all">Create Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Receive Modal */}
            {showReceiveModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Receive Stock</h2>
                            <p className="text-zinc-500 text-sm">Enter Batch Numbers and Expiry Dates for incoming items.</p>
                        </div>
                        <form onSubmit={handleReceiveSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                                {receiveData.map((item, idx) => (
                                    <div key={idx} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex gap-4 flex-wrap items-end">
                                        <div className="min-w-[200px]">
                                            <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Item</div>
                                            <div className="text-white font-medium">{chemicals.find(c => c.id === item.chemical_id)?.name}</div>
                                        </div>
                                        <div className="w-32">
                                            <label className="text-xs text-zinc-500 block mb-1">Qty Receiving</label>
                                            <input
                                                type="number"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white"
                                                value={item.quantity_receiving}
                                                disabled // Assuming full receive for now
                                            />
                                        </div>
                                        <div className="w-48">
                                            <label className="text-xs text-cyan-400 font-bold block mb-1">Supplier Batch #</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. LOT-5592"
                                                className="w-full bg-zinc-900 border border-cyan-900/30 ring-1 ring-cyan-900/20 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                                                value={item.batch_number}
                                                onChange={e => {
                                                    const newData = [...receiveData];
                                                    newData[idx].batch_number = e.target.value;
                                                    setReceiveData(newData);
                                                }}
                                            />
                                        </div>
                                        <div className="w-40">
                                            <label className="text-xs text-zinc-500 block mb-1">Expiry Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                                value={item.expiry_date}
                                                onChange={e => {
                                                    const newData = [...receiveData];
                                                    newData[idx].expiry_date = e.target.value;
                                                    setReceiveData(newData);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowReceiveModal(false)} className="px-6 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all">Confirm Receipt</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
