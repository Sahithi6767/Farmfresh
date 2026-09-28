import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tractor, Package, ShoppingBag, Landmark, Plus, Trash2, 
  Edit3, DollarSign, TrendingUp, BarChart3, PieChart, 
  Upload, X, Check, ShieldAlert, ArrowRight, Settings 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { globalProducts, orders, addProduct, updateProduct, deleteProduct } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, products, add-product
  
  // Edit Modal States
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Spices & Turmeric',
    unit: '1 kg Pack',
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    bestseller: false,
    description: ''
  });

  // Image presets for quick selector simulation
  const imagePresets = [
    { label: 'Turmeric', url: 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600' },
    { label: 'Rice', url: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b8b0?auto=format&fit=crop&q=80&w=600' },
    { label: 'Mangoes', url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=600' },
    { label: 'Corn', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600' },
    { label: 'Dals', url: 'https://images.unsplash.com/photo-1547058886-f33f9a722885?auto=format&fit=crop&q=80&w=600' },
  ];

  // Calculate statistics
  const totalSales = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const uniqueFarmers = new Set(globalProducts.map(p => p.farmer?.name)).size || 1;
  const totalProductsCount = globalProducts.length;

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Product name is required');
    
    addProduct({
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      image: formData.image,
      stock: Number(formData.stock || 50),
      bestseller: formData.bestseller,
      description: formData.description || 'Premium organic direct-trade harvest product.'
    });

    alert('Product added successfully to the live store!');
    
    // reset
    setFormData({
      name: '',
      category: 'Spices & Turmeric',
      unit: '1 kg Pack',
      price: 150,
      originalPrice: 180,
      image: 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600',
      stock: 50,
      bestseller: false,
      description: ''
    });
    
    setActiveSubTab('products');
  };

  // Open Edit Form Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      stock: product.stock || 45,
      bestseller: product.bestseller || false,
      description: product.description || ''
    });
  };

  // Handle Edit Product Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Name required');

    updateProduct(editingProduct.id, {
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      image: formData.image,
      stock: Number(formData.stock),
      bestseller: formData.bestseller,
      description: formData.description
    });

    alert('Product details updated successfully!');
    setEditingProduct(null);
  };

  // Quick edit stock quantity directly from products table
  const handleQuickStockUpdate = (productId, delta) => {
    const target = globalProducts.find(p => p.id === productId);
    if (!target) return;
    const currentStock = target.stock || 30;
    const newStock = Math.max(0, currentStock + delta);
    updateProduct(productId, { stock: newStock });
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Title Ribbon */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/20 text-purple-300 p-3 rounded-full border border-purple-500/30">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Admin Hub Dashboard</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">FarmFresh System Core</span>
          </div>
        </div>

        {/* Action button toggles */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'overview' ? 'bg-purple-600 text-white' : 'hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'products' ? 'bg-purple-600 text-white' : 'hover:bg-white/5'
            }`}
          >
            Manage Catalog
          </button>
          <button
            onClick={() => setActiveSubTab('add-product')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'add-product' ? 'bg-purple-600 text-white' : 'hover:bg-white/5'
            }`}
          >
            Add Harvest
          </button>
        </div>
      </div>

      {/* Main Tabs Area */}
      <AnimatePresence mode="wait">
        
        {/* 1. Overview Section */}
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Total Sales</span>
                  <span className="text-lg font-black text-slate-800">₹{totalSales}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Orders Logged</span>
                  <span className="text-lg font-black text-slate-800">{totalOrdersCount}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                  <Tractor className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Farmer Partners</span>
                  <span className="text-lg font-black text-slate-800">{uniqueFarmers}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Active Items</span>
                  <span className="text-lg font-black text-slate-800">{totalProductsCount}</span>
                </div>
              </div>

            </div>

            {/* Custom SVG Charts Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales Chart (lg:col-span-2) */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4.5 h-4.5 text-purple-500" /> Weekly Sales Analytics (₹)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Live updates</span>
                </div>

                {/* SVG Line/Bar Chart mockup */}
                <div className="pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-40 overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Chart Gradient Path */}
                    <path
                      d="M 10 130 Q 80 110 150 90 T 300 50 T 450 20 L 490 30 L 490 140 L 10 140 Z"
                      fill="url(#chart-grad)"
                      opacity="0.15"
                    />

                    {/* Line Plot */}
                    <path
                      d="M 10 130 Q 80 110 150 90 T 300 50 T 450 20 L 490 30"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Key Dots */}
                    <circle cx="150" cy="90" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                    <circle cx="300" cy="50" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                    <circle cx="450" cy="20" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />

                    {/* Axis Labels */}
                    <text x="10" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Mon</text>
                    <text x="150" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Wed</text>
                    <text x="300" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Fri</text>
                    <text x="450" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Sun</text>
                  </svg>
                </div>
              </div>

              {/* Category Doughnut mockup */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <PieChart className="w-4.5 h-4.5 text-purple-500" /> Category Breakdown
                </h3>
                
                <div className="flex flex-col items-center justify-center pt-2 gap-4">
                  {/* SVG Pie Chart mockup */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="251" strokeDashoffset="75" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251" strokeDashoffset="140" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="251" strokeDashoffset="200" />
                  </svg>
                  
                  {/* Legends */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-600 w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
                      <span>Mangoes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded"></span>
                      <span>Turmeric</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded"></span>
                      <span>Rice</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded"></span>
                      <span>Dals</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* 2. Manage Products Table Section */}
        {activeSubTab === 'products' && (
          <motion.div
            key="products-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-800">Inventory Catalog</h3>
                <span className="text-xs text-slate-400 font-semibold">Verify prices, adjust stock levels and update items</span>
              </div>
              <button
                onClick={() => setActiveSubTab('add-product')}
                className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Harvest
              </button>
            </div>

            {/* Products Table Wrapper */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Produce</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-center">Stock Inventory</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-650">
                    {globalProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-xl border"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block">{prod.unit}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-800 font-bold">₹{prod.price}</span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through block font-semibold">
                              MRP: ₹{prod.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuickStockUpdate(prod.id, -5)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-600 cursor-pointer"
                              title="Decrease stock by 5"
                            >
                              -
                            </button>
                            <span className={`w-8 text-center text-xs font-bold ${
                              (prod.stock || 45) < 15 ? 'text-red-500' : 'text-slate-700'
                            }`}>
                              {prod.stock || 45}
                            </span>
                            <button
                              onClick={() => handleQuickStockUpdate(prod.id, 5)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-600 cursor-pointer"
                              title="Increase stock by 5"
                            >
                              +
                            </button>
                          </div>
                          {(prod.stock || 45) < 15 && (
                            <span className="text-[9px] text-red-500 font-bold text-center block mt-1">
                              Low Inventory!
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Add Harvest Product Form Section */}
        {activeSubTab === 'add-product' && (
          <motion.div
            key="add-product-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800">Add New System Harvest</h3>
              <span className="text-xs text-slate-400 font-semibold">Publish a new organic harvest parameter into storefront listing</span>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic White Wheat"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs font-bold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                  >
                    <option value="Spices & Turmeric">Turmeric & Spices</option>
                    <option value="Fruits">Seasonal Mangoes</option>
                    <option value="Grains">Rice & Grains</option>
                    <option value="Dals & Pulses">Dals & Lentils</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Weight / Unit size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg Bag"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Stock Level Units</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Direct Offer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                  />
                </div>

              </div>

              {/* Quick Preset Images Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">
                  Select Product Image Preset
                </label>
                <div className="flex gap-2 flex-wrap">
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                        formData.image === preset.url
                          ? 'bg-purple-100 border-purple-400 text-purple-700'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {preset.label} Preset
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Tell customers about the grain milling or root drying process..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-purple-650 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                Publish Product
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Edit Modal (Admin Overlay) */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-display font-black text-slate-800 text-sm">Edit Product Catalog Details</h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg bg-white focus:outline-none"
                    >
                      <option value="Spices & Turmeric">Turmeric & Spices</option>
                      <option value="Fruits">Seasonal Mangoes</option>
                      <option value="Grains">Rice & Grains</option>
                      <option value="Dals & Pulses">Dals & Lentils</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Unit size</label>
                    <input
                      type="text"
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Stock Level</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Description</label>
                  <textarea
                    rows="2.5"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs"
                  >
                    Update Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AdminDashboard;
