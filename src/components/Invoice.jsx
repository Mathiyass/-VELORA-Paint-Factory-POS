import React, { useEffect, useState } from 'react';
import { X, Edit3, Printer } from 'lucide-react';

const Invoice = ({ data, onClose, onEdit }) => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'VELORA Paint Factory',
    address: 'No. 45, Industrial Zone, Homagama, Sri Lanka',
    phone: '+94 11 234 5678',
    email: 'sales@velorapaint.lk',
    footerText: 'Thank you for choosing VELORA Paint Factory!'
  });

  useEffect(() => {
    if (data) {
      // Fetch settings whenever invoice is shown to ensure latest info
      window.api?.getSettings().then(settings => {
        if (settings && Object.keys(settings).length > 0) {
          setStoreSettings(prev => ({ ...prev, ...settings }));
        }
      }).catch(console.error);
    }
  }, [data]);

  const handlePrint = () => {
    window.print();
  };

  if (!data) return null;

  // Safe numeric formatting
  const formatCurrency = (value) => (value ?? 0).toLocaleString();

  return (
    <div id="invoice-content" className="font-sans w-full h-full bg-white text-slate-900 absolute top-0 left-0 z-50 p-10 overflow-auto">

      {/* Action Buttons (Hidden on Print) */}
      <div className="fixed top-5 right-5 flex gap-2 print:hidden z-50">
        {onEdit && (
          <button
            onClick={() => onEdit(data)}
            className="p-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 shadow-lg transition-all"
            aria-label="Edit Invoice"
          >
            <Edit3 size={20} />
          </button>
        )}
        <button
          onClick={handlePrint}
          className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 shadow-lg transition-all"
          aria-label="Print Invoice"
        >
          <Printer size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 shadow-lg transition-all"
          aria-label="Close Invoice"
        >
          <X size={20} />
        </button>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none rounded-lg overflow-hidden border border-slate-200 print:border-0">

        {/* Header with Brand Colors */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">{storeSettings.storeName}</h1>
              <div className="text-cyan-100 text-sm space-y-1">
                <p>{storeSettings.address}</p>
                <p className="font-semibold">{storeSettings.phone}</p>
                <p>{storeSettings.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-white/20 mb-2">INVOICE</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-cyan-200">Invoice No:</span>
                  <span className="font-mono font-bold">#{data.id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cyan-200">Date:</span>
                  <span className="font-mono">{new Date(data.date || data.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cyan-200">Time:</span>
                  <span className="font-mono">{new Date(data.date || data.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Payment Info */}
        <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Bill To</h3>
            <p className="font-bold text-xl text-slate-800">{data.customer || data.customer_name || 'Walk-in Customer'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Payment Method</h3>
            <div className="flex flex-col items-end">
              {(() => {
                let methods = [];
                try {
                  const pm = typeof data.paymentMethod === 'string'
                    ? JSON.parse(data.paymentMethod)
                    : (data.paymentMethod || data.payment_method);
                  methods = Array.isArray(pm) ? pm : [{ method: pm?.method || 'Cash', amount: data.total }];
                } catch {
                  methods = [{ method: 'Cash', amount: data.total }];
                }

                const isSplit = methods.length > 1;
                const mainMethod = isSplit ? 'Split Payment' : (methods[0]?.method || 'Cash');

                return (
                  <>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${mainMethod === 'Card' ? 'bg-purple-100 text-purple-700' :
                        mainMethod === 'Split Payment' ? 'bg-indigo-100 text-indigo-700' :
                          mainMethod === 'Credit' ? 'bg-orange-100 text-orange-700' :
                            'bg-emerald-100 text-emerald-700'
                      }`}>
                      {mainMethod}
                    </span>
                    {isSplit && (
                      <div className="text-xs text-slate-500 mt-2 font-mono flex flex-col items-end gap-1">
                        {methods.map((m, i) => (
                          <span key={i}>{m.method}: LKR {formatCurrency(m.amount)}</span>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-cyan-600 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 pl-2">#</th>
                <th className="py-4">Description</th>
                <th className="py-4 text-center">Qty</th>
                <th className="py-4 text-right">Unit Price</th>
                <th className="py-4 text-right pr-2">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(data.items || []).map((item, index) => {
                const unitPrice = item.price_sell ?? item.price_at_sale ?? item.price_unit ?? 0;
                const qty = item.quantity ?? 1;
                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-2 text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-4 font-medium text-slate-800">{item.name || item.product_name}</td>
                    <td className="py-4 text-center text-slate-600 font-mono">{qty}</td>
                    <td className="py-4 text-right text-slate-600 font-mono">LKR {formatCurrency(unitPrice)}</td>
                    <td className="py-4 text-right pr-2 font-bold text-slate-900 font-mono">LKR {formatCurrency(unitPrice * qty)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 pb-8">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono">LKR {formatCurrency((data.total ?? 0) - (data.tax ?? 0) + (data.discount ?? 0))}</span>
                </div>
                {(data.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span className="font-mono">-LKR {formatCurrency(data.discount)}</span>
                  </div>
                )}
                {(data.tax ?? 0) > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Tax</span>
                    <span className="font-mono">+LKR {formatCurrency(data.tax)}</span>
                  </div>
                )}
                <div className="h-px bg-cyan-600"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-900">Grand Total</span>
                  <span className="text-3xl font-black text-cyan-600">
                    LKR {formatCurrency(data.total ?? data.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
          <p className="text-slate-700 font-semibold mb-2">{storeSettings.footerText}</p>
          <p className="text-xs text-slate-400">Please retain this invoice for warranty claims. Goods once sold are not returnable without valid receipt.</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="h-1.5 w-12 bg-cyan-500 rounded-full"></div>
            <div className="h-1.5 w-3 bg-cyan-300 rounded-full"></div>
            <div className="h-1.5 w-3 bg-cyan-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-0 { border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;