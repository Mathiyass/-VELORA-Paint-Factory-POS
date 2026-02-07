
import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, PauseCircle, PlayCircle, Percent, Award, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Cart({
    cart,
    totals,
    actions,
    onCheckout,
    onDiscount,
    onHold,
    onRecall,
    discount,
    usePoints
}) {
    const { subtotal, taxAmount, total } = totals;
    const pointsDiscount = usePoints ? subtotal : 0; // Simplified for display, logic is in hook/Checkout

    return (
        <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl z-10">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="text-cyan-500" /> Current Sale
                </h2>
                <div className="flex gap-2">
                    <button onClick={onHold} disabled={cart.length === 0} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"><PauseCircle size={18} /></button>
                    <button onClick={onRecall} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"><PlayCircle size={18} /></button>
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
                                    <button onClick={() => actions.updateQuantity(item.id, -1)} className="hover:text-white text-zinc-500"><Minus size={14} /></button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => actions.updateQuantity(item.id, 1)} className="hover:text-white text-zinc-500"><Plus size={14} /></button>
                                </div>
                            </div>
                            <button onClick={() => actions.removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-full p-1 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between text-zinc-400 text-sm"><span>Subtotal</span><span>{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-zinc-400 text-sm">
                    <button onClick={onDiscount} className="flex items-center gap-1 text-red-500 hover:text-red-400"><Percent size={14} /> Discount</button>
                    <span className="text-red-400">-{discount.toLocaleString()}</span>
                </div>
                {usePoints && (
                    <div className="flex justify-between text-emerald-400 text-sm font-medium animate-pulse">
                        <span className="flex items-center gap-1"><Award size={14} /> Points Redeemed</span>
                        <span>-{pointsDiscount.toLocaleString()}</span>
                    </div>
                )}
                {taxAmount > 0 && <div className="flex justify-between text-zinc-400 text-sm"><span>Tax</span><span>+{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}

                <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span className="text-cyan-400">LKR {total.toLocaleString()}</span>
                </div>

                <button onClick={onCheckout} disabled={cart.length === 0} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex justify-center items-center gap-2">
                    <CreditCard size={20} /> Checkout (F12)
                </button>
            </div>
        </div>
    );
}
