
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { usePOS } from '../hooks/usePOS';
import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import CheckoutModal from '../components/pos/CheckoutModal';
import Invoice from '../components/Invoice';
import { playSound } from '../utils/sounds';

export default function POS() {
  const {
    products,
    categories,
    cart,
    loading,
    totals,
    actions,
    state
  } = usePOS();

  const [printData, setPrintData] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
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

  const handleCheckoutProcess = async (paymentDetails) => {
    try {
      const invoice = await actions.processCheckout(paymentDetails);
      setPrintData(invoice);
      setIsCheckoutOpen(false);
    } catch (err) {
      console.error(err);
      // Error handling already in hook
    }
  };

  const handleRecall = () => {
    actions.fetchHeldCarts();
    setIsRecallModalOpen(true);
  };

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
              value={state.searchTerm} onChange={e => actions.setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-md pb-1 custom-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => actions.setSelectedCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${state.selectedCategory === c
                  ? 'bg-cyan-600 border-cyan-500 text-black shadow-lg shadow-cyan-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500">Loading products...</div>
        ) : (
          <ProductGrid products={products} onAdd={actions.addToCart} />
        )}
      </div>

      {/* RIGHT: Cart */}
      <Cart
        cart={cart}
        totals={totals}
        actions={actions}
        onCheckout={() => setIsCheckoutOpen(true)}
        onDiscount={() => setIsDiscountModalOpen(true)}
        onHold={() => actions.holdCurrentCart(state.customer)}
        onRecall={handleRecall}
        discount={state.discount}
        usePoints={usePoints}
      />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={totals.total}
        onProcess={handleCheckoutProcess}
        customer={state.customer}
        setCustomer={actions.setCustomer}
        // Mocking points for now as it needs context or api fetch for specific user
        customerPoints={0}
        usePoints={usePoints}
        setUsePoints={setUsePoints}
      />

      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Manual Discount</h3>
            <input type="number" autoFocus className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mb-4 outline-none focus:border-cyan-600 transition-colors" placeholder="Amount" value={state.discount} onChange={e => actions.setDiscount(parseFloat(e.target.value) || 0)} />
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
              <button onClick={() => setIsRecallModalOpen(false)} className="text-zinc-500 hover:text-white">Close</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {state.heldCarts.length === 0 ? <p className="text-zinc-500">No held carts.</p> : state.heldCarts.map(c => (
                <div key={c.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <div className="font-bold text-white">{c.customer_name || 'Unknown'}</div>
                    <div className="text-xs text-zinc-500">{new Date(c.created_at).toLocaleString()} • {c.items.length} items</div>
                  </div>
                  <button onClick={() => { actions.restoreHeldCart(c); setIsRecallModalOpen(false); }} className="bg-cyan-600 text-black px-3 py-1.5 rounded-lg text-sm font-bold">Restore</button>
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