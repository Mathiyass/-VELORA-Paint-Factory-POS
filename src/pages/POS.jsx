import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, User, List, X, PauseCircle, PlayCircle, Percent, Award, Split, LayoutGrid, AlertCircle, RefreshCw, Crown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Invoice from '../components/Invoice';
import { playSound } from '../utils/sounds';
import { useToast } from '../context/ToastContext';

export default function POS() {
  const { success, error, warning } = useToast();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [customerPoints, setCustomerPoints] = useState(0);
  const [customerCreditInfo, setCustomerCreditInfo] = useState(null);
  const [usePoints, setUsePoints] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Advanced Payment State
  const [paymentMode, setPaymentMode] = useState('Simple'); // Simple, Split
  const [simpleMethod, setSimpleMethod] = useState('Cash'); // Cash, Card, Credit
  const [splitPayments, setSplitPayments] = useState([{ method: 'Cash', amount: 0 }]); // Array of { method, amount }

  // Features
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [heldCarts, setHeldCarts] = useState([]);

  const searchInputRef = useRef(null);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'F12' && cart.length > 0 && !isCheckoutOpen) { e.preventDefault(); setIsCheckoutOpen(true); }
      if (e.key === 'Escape') {
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        if (isDiscountModalOpen) setIsDiscountModalOpen(false);
        if (isRecallModalOpen) setIsRecallModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, isCheckoutOpen, isDiscountModalOpen, isRecallModalOpen]);

  // --- Print Trigger ---
  useEffect(() => {
    if (printData) {
      playSound('success');
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [printData]);

  // --- Load Data ---
  const loadData = async () => {
    if (window.api) {
      setProducts(await window.api.getProducts());
      const s = await window.api.getSettings();
      if (s && s.taxRate) setTaxRate(parseFloat(s.taxRate) || 0);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  // --- Customer Logic ---
  useEffect(() => {
    if (customer && window.api) {
      const timer = setTimeout(async () => {
        try {
          const customers = await window.api.getCustomers();
          const found = customers.find(c => c.name.toLowerCase() === customer.toLowerCase());
          if (found) {
            setCustomerPoints(found.points);
            // Simple Credit Check
            // Ideally we'd have a stronger debt calculation
            setCustomerCreditInfo({ limit: found.credit_limit || 0, debt: 0 });
          } else {
            setCustomerPoints(0);
            setCustomerCreditInfo(null);
          }
        } catch (e) { console.error(e); }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [customer]);

  // --- Cart Actions ---
  const addToCart = (product) => {
    playSound('beep');
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) {
          playSound('error');
          error('Insufficient stock!');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  // --- Totals Calculation ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price_sell * item.quantity), 0);
  const maxPointsRedeemable = Math.min(customerPoints, subtotal - discount);
  const pointsDiscount = usePoints ? maxPointsRedeemable : 0;
  const taxableAmount = Math.max(0, subtotal - discount - pointsDiscount);
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;

  const getTier = (pts) => {
    if (pts > 1000) return { name: 'Gold', color: 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20' };
    if (pts > 500) return { name: 'Silver', color: 'text-slate-300 border-slate-500/50 bg-slate-900/20' };
    return { name: 'Bronze', color: 'text-orange-400 border-orange-500/50 bg-orange-900/20' };
  };

  // --- Checkout Logic ---
  useEffect(() => {
    // Auto-set split amount to total when single payment
    if (isCheckoutOpen && paymentMode === 'Simple') {
      // No action needed really, simple mode uses 'total' implies full payment
    }
    if (isCheckoutOpen && paymentMode === 'Split') {
      // Initialize split with existing defaults if empty
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (splitPayments.length === 0) setSplitPayments([{ method: 'Cash', amount: total }]);
    }
  }, [isCheckoutOpen, total, paymentMode, splitPayments.length]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      let finalPaymentMethod = [];

      if (paymentMode === 'Simple') {
        finalPaymentMethod = [{ method: simpleMethod, amount: total }];
      } else {
        // Validate Split
        const sum = splitPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
        if (Math.abs(sum - total) > 1) {
          error(`Total payment (${sum.toLocaleString()}) must match Invoice Total (${total.toLocaleString()})`);
          return;
        }
        finalPaymentMethod = splitPayments;
      }

      // Check Credit
      const creditPayment = finalPaymentMethod.find(p => p.method === 'Credit');
      if (creditPayment && customerCreditInfo) {
        if ((customerCreditInfo.debt + creditPayment.amount) > customerCreditInfo.limit) {
          // Blocking confirm is safer for POS than a custom modal without more work
          if (!confirm('Credit Limit Exceeded. Proceed with this transaction?')) {
            warning('Transaction cancelled due to credit limit.');
            return;
          }
        }
      }

      const txData = {
        items: cart,
        total,
        discount: discount + pointsDiscount,
        tax: taxAmount,
        pointsUsed: usePoints ? maxPointsRedeemable : 0,
        customer,
        payment_method: finalPaymentMethod // Send the JSON array
      };

      await window.api.createTransaction(txData);

      const newInvoice = {
        id: uuidv4(),
        items: [...cart],
        total,
        tax: taxAmount,
        discount: discount + pointsDiscount,
        customer,
        paymentMethod: finalPaymentMethod, // Passed to invoice for display
        date: new Date().toISOString()
      };

      setPrintData(newInvoice);
      success('Transaction completed successfully!');
      resetPos();
      loadData(); // Refresh stock

    } catch (err) {
      playSound('error');
      error("Transaction Failed: " + err.message);
    }
  };

  const resetPos = () => {
    setCart([]);
    setCustomer('');
    setDiscount(0);
    setUsePoints(false);
    setIsCheckoutOpen(false);
    setPaymentMode('Simple');
    setSplitPayments([{ method: 'Cash', amount: 0 }]);
  };

  // --- Hold/Recall ---
  const handleHoldCart = async () => {
    if (cart.length === 0) return;
    const name = prompt("Reference Name:", customer || "Customer");
    if (!name) return;
    await window.api.holdCart({ customer: name, items: cart });
    resetPos();
    playSound('success');
  };

  const loadHeldCarts = async () => {
    setHeldCarts(await window.api.getHeldCarts());
    setIsRecallModalOpen(true);
  };

  const restoreCart = async (c) => {
    setCart(c.items);
    setCustomer(c.customer_name);
    await window.api.deleteHeldCart(c.id);
    setIsRecallModalOpen(false);
    playSound('beep');
  };

  // --- Split Payment Helpers ---
  const addSplitRow = () => setSplitPayments([...splitPayments, { method: 'Cash', amount: 0 }]);
  const updateSplitRow = (idx, field, val) => {
    const newRows = [...splitPayments];
    newRows[idx][field] = val;
    setSplitPayments(newRows);
  };
  const removeSplitRow = (idx) => {
    const newRows = splitPayments.filter((_, i) => i !== idx);
    setSplitPayments(newRows);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))].sort();

  return (
    <div className="flex h-full bg-[var(--color-bg-app)] text-zinc-100 relative font-sans overflow-hidden">

      {/* LEFT: Product Grid */}
      <div className="flex-1 flex flex-col p-6 pr-2">
        <header className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              ref={searchInputRef}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 outline-none text-white placeholder-zinc-500 transition-colors shadow-sm"
              placeholder="Search products (F2)..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-md pb-1 custom-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${selectedCategory === c
                  ? 'bg-cyan-600 border-cyan-500 text-black shadow-lg shadow-cyan-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`text-left bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm group hover:border-cyan-500/50 transition-all ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="aspect-video bg-zinc-950 relative">
                  {product.image ? (
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-950"><LayoutGrid size={32} /></div>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-mono font-bold border ${product.stock < 5 ? 'bg-red-900/80 text-red-200 border-red-800' : 'bg-black/60 text-cyan-400 border-zinc-800'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-zinc-200 truncate">{product.name}</h3>
                  <div className="text-cyan-400 font-bold mt-1">LKR {product.price_sell.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl z-10">
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-cyan-500" /> Current Sale
          </h2>
          <div className="flex gap-2">
            <button onClick={handleHoldCart} disabled={cart.length === 0} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"><PauseCircle size={18} /></button>
            <button onClick={loadHeldCarts} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"><PlayCircle size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex gap-3 group relative hover:border-cyan-900/50 transition-colors"
              >
                <div className="w-14 h-14 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-zinc-800">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <List size={20} className="text-zinc-600" />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="font-bold text-sm text-zinc-200 truncate">{item.name}</div>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">LKR {item.price_sell.toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end justify-between py-1">
                  <div className="flex items-center gap-3 bg-zinc-900 rounded-lg border border-zinc-800 p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-white text-zinc-500"><Minus size={14} /></button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-white text-zinc-500"><Plus size={14} /></button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-full p-1 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-3">
          <div className="flex justify-between text-zinc-400 text-sm"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-zinc-400 text-sm">
            <button onClick={() => setIsDiscountModalOpen(true)} className="flex items-center gap-1 text-red-500 hover:text-red-400"><Percent size={14} /> Discount</button>
            <span className="text-red-400">-{discount.toLocaleString()}</span>
          </div>
          {usePoints && (
            <div className="flex justify-between text-emerald-400 text-sm font-medium animate-pulse">
              <span className="flex items-center gap-1"><Award size={14} /> Points Redeemed</span>
              <span>-{pointsDiscount.toLocaleString()}</span>
            </div>
          )}
          {taxRate > 0 && <div className="flex justify-between text-zinc-400 text-sm"><span>Tax ({taxRate}%)</span><span>+{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}

          <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-zinc-800">
            <span>Total</span>
            <span className="text-cyan-400">LKR {total.toLocaleString()}</span>
          </div>

          <button onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex justify-center items-center gap-2">
            <CreditCard size={20} /> Checkout (F12)
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-cyan-900/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Complete Transaction</h2>
              <button onClick={() => setIsCheckoutOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
            </div>
            <form onSubmit={handleCheckout}>
              <div className="mb-6">
                <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Customer</label>
                <input autoFocus className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-600 text-white"
                  placeholder="Customer Name (Optional)"
                  value={customer} onChange={e => setCustomer(e.target.value)}
                />
                {customerPoints > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded-lg border ${getTier(customerPoints).color}`}>
                      <Crown size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{getTier(customerPoints).name} Member</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-900/10 border border-emerald-500/30 p-2 rounded-lg">
                      <div className="text-emerald-400 text-sm font-bold flex items-center gap-1"><Award size={16} /> {customerPoints} Points</div>
                      <button type="button" onClick={() => setUsePoints(!usePoints)} className={`text-xs font-bold px-3 py-1 rounded ${usePoints ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-emerald-400'}`}>
                        {usePoints ? 'Applied' : 'Redeem'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex gap-2 mb-4 bg-zinc-950 p-1 rounded-xl">
                  <button type="button" onClick={() => setPaymentMode('Simple')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${paymentMode === 'Simple' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>Simple</button>
                  <button type="button" onClick={() => setPaymentMode('Split')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${paymentMode === 'Split' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>Split / Multi</button>
                </div>

                {paymentMode === 'Simple' ? (
                  <div className="grid grid-cols-3 gap-3">
                    {['Cash', 'Card', 'Credit'].map(m => (
                      <button key={m} type="button" onClick={() => setSimpleMethod(m)}
                        className={`py-3 rounded-xl border font-bold ${simpleMethod === m ? 'bg-cyan-600 border-cyan-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    {splitPayments.map((row, idx) => (
                      <div key={idx} className="flex gap-2">
                        <select value={row.method} onChange={e => updateSplitRow(idx, 'method', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm outline-none">
                          <option>Cash</option><option>Card</option><option>Credit</option><option>Transfer</option>
                        </select>
                        <input type="number" value={row.amount} onChange={e => updateSplitRow(idx, 'amount', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm outline-none" placeholder="Amount" />
                        <button type="button" onClick={() => removeSplitRow(idx)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={addSplitRow} className="text-xs text-cyan-500 font-bold hover:underline">+ Add Method</button>

                    <div className="pt-2 border-t border-zinc-800 text-right">
                      <span className="text-zinc-500 text-xs mr-2">Remaining:</span>
                      <span className={`font-bold ${Math.abs(splitPayments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0) - total) > 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {(total - splitPayments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-zinc-400">Total Payable</span>
                <span className="text-xl font-bold text-cyan-400">LKR {total.toLocaleString()}</span>
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                Finalize Sale
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Manual Discount</h3>
            <input type="number" autoFocus className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mb-4 outline-none focus:border-cyan-600 transition-colors" placeholder="Amount" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
            <button onClick={() => setIsDiscountModalOpen(false)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">Apply</button>
          </div>
        </div>
      )}

      {/* Recall Modal */}
      {isRecallModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Held Carts</h3>
              <button onClick={() => setIsRecallModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {heldCarts.length === 0 ? <p className="text-zinc-500">No held carts.</p> : heldCarts.map(c => (
                <div key={c.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <div className="font-bold text-white">{c.customer_name || 'Unknown'}</div>
                    <div className="text-xs text-zinc-500">{new Date(c.created_at).toLocaleString()} • {c.items.length} items</div>
                  </div>
                  <button onClick={() => restoreCart(c)} className="bg-cyan-600 text-black px-3 py-1.5 rounded-lg text-sm font-bold">Restore</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Invoice data={printData} onClose={() => setPrintData(null)} />
    </div>
  );
}