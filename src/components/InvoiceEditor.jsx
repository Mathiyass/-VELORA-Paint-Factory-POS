import React, { useState } from 'react';
import { X, Save, Trash2, Calendar, User, AlertTriangle, Plus, Minus, Package } from 'lucide-react';

export default function InvoiceEditor({ invoice, onClose, onSave, allProducts }) {
    const [editedInvoice, setEditedInvoice] = useState(() =>
        invoice ? JSON.parse(JSON.stringify(invoice)) : null
    );
    const [isDirty, setIsDirty] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductSearch, setShowProductSearch] = useState(false);

    if (!editedInvoice) return null;

    const handleUpdateField = (field, value) => {
        setEditedInvoice(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleQuantityChange = (index, delta) => {
        setEditedInvoice(prev => {
            const newItems = [...prev.items];
            const item = newItems[index];
            const newQty = Math.max(1, (item.quantity || 1) + delta);
            newItems[index] = { ...item, quantity: newQty };
            return { ...prev, items: newItems };
        });
        setIsDirty(true);
    };

    const handlePriceChange = (index, newPrice) => {
        setEditedInvoice(prev => {
            const newItems = [...prev.items];
            newItems[index] = {
                ...newItems[index],
                price_sell: parseFloat(newPrice) || 0,
                price_at_sale: parseFloat(newPrice) || 0,
                price_unit: parseFloat(newPrice) || 0
            };
            return { ...prev, items: newItems };
        });
        setIsDirty(true);
    };

    const handleRemoveItem = (index) => {
        setEditedInvoice(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            return { ...prev, items: newItems };
        });
        setIsDirty(true);
    };

    const handleAddItem = (product) => {
        setEditedInvoice(prev => {
            const existingItemIndex = prev.items.findIndex(i =>
                (i.product_id || i.id) === product.id
            );
            if (existingItemIndex >= 0) {
                const newItems = [...prev.items];
                newItems[existingItemIndex].quantity = (newItems[existingItemIndex].quantity || 1) + 1;
                return { ...prev, items: newItems };
            } else {
                return {
                    ...prev,
                    items: [...prev.items, {
                        product_id: product.id,
                        name: product.name,
                        product_name: product.name,
                        quantity: 1,
                        price_sell: product.price_sell || product.sell_price || 0,
                        price_at_sale: product.price_sell || product.sell_price || 0,
                        price_unit: product.price_sell || product.sell_price || 0
                    }]
                };
            }
        });
        setIsDirty(true);
        setSearchTerm('');
        setShowProductSearch(false);
    };

    // Get item price with fallbacks
    const getItemPrice = (item) => {
        return item.price_sell ?? item.price_at_sale ?? item.price_unit ?? 0;
    };

    // Recalculate totals
    const subtotal = editedInvoice.items.reduce((sum, item) => {
        return sum + (getItemPrice(item) * (item.quantity || 1));
    }, 0);

    const discount = editedInvoice.discount_amount ?? editedInvoice.discount ?? 0;
    const tax = editedInvoice.tax_amount ?? editedInvoice.tax ?? 0;
    const total = subtotal + tax - discount;

    const handleSave = () => {
        onSave({
            ...editedInvoice,
            total_amount: total,
            total: total,
            tax_amount: tax,
            discount_amount: discount
        });
    };

    // Format date for datetime-local input
    const formatDateForInput = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return d.toISOString().slice(0, 16);
        } catch {
            return new Date().toISOString().slice(0, 16);
        }
    };

    const filteredProducts = (allProducts || []).filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-700 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="bg-cyan-600 text-black px-3 py-1 rounded-lg text-sm font-black">EDIT</span>
                            <span className="text-cyan-400 font-mono">INV-{String(editedInvoice.id).padStart(6, '0')}</span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
                            <AlertTriangle size={12} />
                            <span>All changes will be logged for audit purposes</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Invoice Details */}
                    <div className="flex-1 p-6 overflow-y-auto border-r border-zinc-800 custom-scrollbar">

                        {/* Customer & Date */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={editedInvoice.customer_name || editedInvoice.customer || ''}
                                        onChange={(e) => {
                                            handleUpdateField('customer_name', e.target.value);
                                            handleUpdateField('customer', e.target.value);
                                        }}
                                        placeholder="Walk-in Customer"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Date & Time</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-3 text-zinc-500" />
                                    <input
                                        type="datetime-local"
                                        value={formatDateForInput(editedInvoice.date_created || editedInvoice.timestamp || editedInvoice.date)}
                                        onChange={(e) => {
                                            const newDate = new Date(e.target.value).toISOString();
                                            handleUpdateField('date_created', newDate);
                                            handleUpdateField('timestamp', newDate);
                                            handleUpdateField('date', newDate);
                                        }}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Items ({editedInvoice.items?.length || 0})
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProductSearch(!showProductSearch)}
                                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        <Plus size={14} /> Add Item
                                    </button>

                                    {/* Product Search Dropdown */}
                                    {showProductSearch && (
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                            <div className="p-3 border-b border-zinc-700">
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-zinc-600 rounded-lg py-2 px-3 text-sm focus:border-cyan-500 focus:outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {filteredProducts.length === 0 ? (
                                                    <div className="p-4 text-center text-zinc-500 text-sm">No products found</div>
                                                ) : (
                                                    filteredProducts.map(p => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => handleAddItem(p)}
                                                            className="w-full text-left px-4 py-3 hover:bg-zinc-700 border-b border-zinc-700/50 last:border-0 flex items-center gap-3 transition-colors"
                                                        >
                                                            <Package size={16} className="text-zinc-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-white truncate">{p.name}</div>
                                                                <div className="text-xs text-zinc-500 flex gap-3">
                                                                    <span>LKR {(p.price_sell ?? 0).toLocaleString()}</span>
                                                                    <span className={p.stock < 5 ? 'text-red-400' : ''}>Stock: {p.stock ?? 0}</span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2">
                                {(editedInvoice.items || []).length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
                                        No items in this invoice. Click "Add Item" to add products.
                                    </div>
                                ) : (
                                    editedInvoice.items.map((item, idx) => {
                                        const price = getItemPrice(item);
                                        const qty = item.quantity || 1;
                                        return (
                                            <div key={idx} className="flex items-center gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 group hover:border-zinc-700 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">
                                                        {item.name || item.product_name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-zinc-500">Unit Price:</span>
                                                        <input
                                                            type="number"
                                                            value={price}
                                                            onChange={(e) => handlePriceChange(idx, e.target.value)}
                                                            className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-cyan-400 font-mono focus:border-cyan-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-700">
                                                    <button
                                                        onClick={() => handleQuantityChange(idx, -1)}
                                                        className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-cyan-400 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm w-8 text-center font-mono text-white">{qty}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(idx, 1)}
                                                        className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-cyan-400 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-sm font-mono text-cyan-400 w-28 text-right font-bold">
                                                    LKR {(price * qty).toLocaleString()}
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Panel */}
                    <div className="w-80 bg-zinc-950/50 p-6 flex flex-col">
                        <h3 className="font-bold text-white text-lg mb-6">Order Summary</h3>

                        <div className="space-y-4 text-sm flex-1">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span className="font-mono">LKR {subtotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center text-zinc-400">
                                <span>Discount</span>
                                <input
                                    type="number"
                                    className="w-24 bg-zinc-900 text-right border border-zinc-700 rounded px-2 py-1 font-mono focus:border-cyan-500 focus:outline-none text-red-400"
                                    value={discount}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        handleUpdateField('discount_amount', val);
                                        handleUpdateField('discount', val);
                                    }}
                                />
                            </div>

                            <div className="flex justify-between items-center text-zinc-400">
                                <span>Tax</span>
                                <input
                                    type="number"
                                    className="w-24 bg-zinc-900 text-right border border-zinc-700 rounded px-2 py-1 font-mono focus:border-cyan-500 focus:outline-none"
                                    value={tax}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        handleUpdateField('tax_amount', val);
                                        handleUpdateField('tax', val);
                                    }}
                                />
                            </div>

                            <div className="h-px bg-cyan-600 my-4"></div>

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-black text-cyan-400 font-mono">
                                    LKR {total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-3 pt-6 border-t border-zinc-800">
                            <button
                                onClick={handleSave}
                                disabled={!isDirty}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}