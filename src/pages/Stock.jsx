import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Trash2, Save, X, Image as ImageIcon, Edit, AlertTriangle, Download, UploadCloud, Link as LinkIcon, FlaskConical } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useLocation } from 'react-router-dom';

export default function Stock() {
  const { success, error } = useToast();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = {
    id: null, name: '', sku: '', category: 'General',
    price_buy: '', price_sell: '', stock: '',
    image: '', warranty: '', formula_id: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    if (window.api) {
      setProducts(await window.api.getProducts());
      if (window.api.getFormulas) {
        setFormulas(await window.api.getFormulas());
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('filter') === 'low') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilterLowStock(true);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      ...product,
      price_buy: product.price_buy || '',
      price_sell: product.price_sell || '',
      stock: product.stock || '',
      image: product.image || '',
      warranty: product.warranty || '',
      formula_id: product.formula_id || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price_buy: parseFloat(formData.price_buy) || 0,
        price_sell: parseFloat(formData.price_sell) || 0,
        stock: parseInt(formData.stock) || 0,
        formula_id: formData.formula_id ? parseInt(formData.formula_id) : null
      };

      if (isEditing) {
        await window.api.updateProduct(productData);
      } else {
        await window.api.addProduct(productData);
      }
      setIsModalOpen(false);
      loadData();
      success(isEditing ? "Product updated successfully" : "Product created successfully");
    } catch (err) {
      error("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await window.api.deleteProduct(id);
      loadData();
      success("Product deleted");
    } catch {
      error("Failed to delete product");
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLowStock = filterLowStock ? p.stock < 10 : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))].sort();

  return (
    <div className="h-full bg-[var(--color-bg-app)] text-zinc-100 flex flex-col font-sans">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white tracking-tight">
              <Package className="text-cyan-500" size={32} />
              Inventory Management
            </h1>
            <p className="text-zinc-500 mt-1">Manage products, pricing, and manufacturing links</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.api.importProductsFromCSV()} className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <UploadCloud size={18} /> Import CSV
            </button>
            <button onClick={openAddModal} className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold transition-colors">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-1 custom-scrollbar">
            {filterLowStock && (
              <button onClick={() => setFilterLowStock(false)} className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-900/30">
                Low Stock Only <X size={12} />
              </button>
            )}
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${selectedCategory === c ? 'bg-zinc-800 border-cyan-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(p => {
            const hasFormula = !!p.formula_id;
            const profit = p.price_sell - p.price_buy;
            const isLow = p.stock < 10; // Threshold

            return (
              <div key={p.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group relative overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-700" size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-zinc-100 truncate pr-2">{p.name}</h3>
                      {hasFormula && <FlaskConical className="text-fuchsia-500 shrink-0" size={18} title="Linked to Formula" />}
                    </div>
                    <div className="text-xs font-mono text-zinc-500 mb-2">{p.sku}</div>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{p.category}</span>
                      {p.warranty && <span className="bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{p.warranty}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase font-bold">Selling Price</div>
                    <div className="text-lg font-bold text-cyan-400">LKR {p.price_sell.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 uppercase font-bold">Stock Level</div>
                    <div className={`text-lg font-bold flex items-center justify-end gap-1 ${isLow ? 'text-red-500' : 'text-emerald-400'}`}>
                      {isLow && <AlertTriangle size={14} />} {p.stock}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-zinc-500 px-1">
                  <span>Cost: LKR {p.price_buy.toLocaleString()}</span>
                  <span>Margin: <span className="text-zinc-300">+{profit.toLocaleString()}</span></span>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => openEditModal(p)} className="p-2 bg-zinc-800 hover:bg-cyan-900 text-white rounded-lg shadow-lg border border-zinc-700 hover:border-cyan-500 transition-colors"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-zinc-800 hover:bg-red-900 text-white rounded-lg shadow-lg border border-zinc-700 hover:border-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-900/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Product Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">SKU (Auto if empty)</label>
                  <input name="sku" value={formData.sku} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-mono placeholder:text-zinc-600" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                  <input list="cat-suggestions" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                  <datalist id="cat-suggestions">
                    <option value="General" /><option value="Paint" /><option value="Primer" /><option value="Coating" /><option value="Thinner" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Cost Price (LKR)</label>
                  <input type="number" name="price_buy" value={formData.price_buy} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Selling Price (LKR)</label>
                  <input required type="number" name="price_sell" value={formData.price_sell} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Initial Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Warranty Info</label>
                  <input name="warranty" value={formData.warranty} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2"><LinkIcon size={14} /> Link to Manufacturing Formula</label>
                <select name="formula_id" value={formData.formula_id} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none">
                  <option value="">-- No Formula Linked --</option>
                  {formulas.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1">Linking a formula allows production orders to automatically update this product's stock.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Image URL</label>
                <div className="flex gap-4">
                  <input name="image" value={formData.image} onChange={handleInputChange} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none placeholder:text-zinc-600" />
                  <div className="w-16 h-12 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center overflow-hidden">
                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-600" />}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all">
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}