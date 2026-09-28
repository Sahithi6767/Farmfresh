import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Package, ShoppingBag, PlusCircle, Trash2, 
  Landmark, CheckCircle, Edit3, DollarSign, BarChart3, 
  PieChart, X, Check, Tractor, Truck, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FarmerDashboard = () => {
  const { 
    user, globalProducts, orders, addFarmerProduct, 
    updateOrderStatus, deleteProduct, updateProduct 
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, products, add-product, orders
  
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

  // Filter products listed by this farmer
  const farmerProducts = globalProducts.filter(
    (prod) => prod.farmer && prod.farmer.farmName === user.farmName
  );

  // Filter orders that contain this farmer's products
  const farmerOrders = orders.filter((ord) => 
    ord.items.some((item) => item.farmerName === user.name)
  );

  // Total stock units
  const totalStock = farmerProducts.reduce((sum, p) => sum + (p.stock || 45), 0);

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Product name is required');

    addFarmerProduct({
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      image: formData.image,
      stock: Number(formData.stock || 55),
      bestseller: formData.bestseller,
      description: formData.description || 'Harvested fresh from our organic fields in Jagtial.'
    });

    alert('Harvest listed successfully for storefront customers!');

    // Reset Form
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
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/20 text-amber-300 p-3 rounded-full border border-amber-500/30">
            <Tractor className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Farmer Hub Dashboard</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Partner Farm: {user.farmName}
            </span>
          </div>
        </div>

        {/* Action button toggles */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'overview' ? 'bg-amber-500 text-white shadow-sm' : 'hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'products' ? 'bg-amber-500 text-white shadow-sm' : 'hover:bg-white/5'
            }`}
          >
            Manage Crops
          </button>
          <button
            onClick={() => setActiveSubTab('add-product')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'add-product' ? 'bg-amber-500 text-white shadow-sm' : 'hover:bg-white/5'
            }`}
          >
            List Harvest
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              activeSubTab === 'orders' ? 'bg-amber-500 text-white shadow-sm' : 'hover:bg-white/5'
            }`}
          >
            Orders ({farmerOrders.length})
          </button>
        </div>
      </div>

      {/* Main Tabs Content */}
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
            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Earnings</span>
                  <span className="text-lg font-black text-slate-800">₹{user.balance?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Active Crops</span>
                  <span className="text-lg font-black text-slate-800">{farmerProducts.length} Items</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Orders Received</span>
                  <span className="text-lg font-black text-slate-800">{farmerOrders.length} Orders</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">Total Stock</span>
                  <span className="text-lg font-black text-slate-800">{totalStock} units</span>
                </div>
              </div>

            </div>

            {/* Visual Custom SVG Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Earnings Sales Line Chart (lg:col-span-2) */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4.5 h-4.5 text-amber-500" /> Farm Sales Trends (₹)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded-lg">Realtime dispatch</span>
                </div>

                <div className="pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-40 overflow-visible">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Gradient Fill */}
                    <path
                      d="M 10 135 Q 90 95 160 110 T 320 65 T 460 35 L 490 25 L 490 140 L 10 140 Z"
                      fill="url(#farm-chart-grad)"
                      opacity="0.15"
                    />

                    {/* Chart Line path */}
                    <path
                      d="M 10 135 Q 90 95 160 110 T 320 65 T 460 35 L 490 25"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <defs>
                      <linearGradient id="farm-chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <circle cx="160" cy="110" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                    <circle cx="320" cy="65" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                    <circle cx="460" cy="35" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />

                    <text x="10" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Mon</text>
                    <text x="160" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Wed</text>
                    <text x="320" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Fri</text>
                    <text x="460" y="148" fill="#94a3b8" fontSize="9" fontWeight="bold">Sun</text>
                  </svg>
                </div>
              </div>

              {/* Crop Categories representation */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <PieChart className="w-4.5 h-4.5 text-amber-500" /> Crop Distribution
                </h3>
                
                <div className="flex flex-col items-center justify-center pt-2 gap-4">
                  {/* SVG Pie Chart */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="251" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251" strokeDashoffset="110" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251" strokeDashoffset="180" />
                  </svg>
                  
                  {/* Legends */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-650 w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded"></span>
                      <span>Turmeric ({farmerProducts.filter(p => p.category === 'Spices & Turmeric').length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
                      <span>Mangoes ({farmerProducts.filter(p => p.category === 'Fruits').length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded"></span>
                      <span>Rice ({farmerProducts.filter(p => p.category === 'Grains').length})</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* 2. Products Catalog Table */}
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
                <h3 className="text-base font-bold text-slate-800">Active Crop Listings</h3>
                <span className="text-xs text-slate-400 font-semibold">Adjust stock units or update direct prices</span>
              </div>
              <button
                onClick={() => setActiveSubTab('add-product')}
                className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Add Harvest
              </button>
            </div>

            {/* Table layout */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Harvest</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-center">Stock units</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-650">
                    {farmerProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-xl border"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{prod.name}</span>
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
                            <span className="text-[10px] text-slate-400 line-through block">
                              MRP: ₹{prod.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuickStockUpdate(prod.id, -5)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-650 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-700">
                              {prod.stock || 45}
                            </span>
                            <button
                              onClick={() => handleQuickStockUpdate(prod.id, 5)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-650 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 bg-blue-55 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors cursor-pointer"
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

        {/* 3. Add Product Panel */}
        {activeSubTab === 'add-product' && (
          <motion.div
            key="add-product-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800">List New Harvest Produce</h3>
              <span className="text-xs text-slate-400 font-semibold">Publish new fresh crop parameters into the catalog storefront</span>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sona Masuri Aged Rice"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none focus:border-amber-500"
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
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Unit size</label>
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
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Stock Level units</label>
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

              {/* Quick image preset selectors */}
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
                          ? 'bg-amber-100 border-amber-400 text-amber-700'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-650'
                      }`}
                    >
                      {preset.label} Preset
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Description Details</label>
                <textarea
                  rows="3"
                  placeholder="Details of harvesting, drying or milling..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                List Harvest
              </button>
            </form>
          </motion.div>
        )}

        {/* 4. Orders Fulfillment panel */}
        {activeSubTab === 'orders' && (
          <motion.div
            key="orders-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800">Fulfillment Queue</h3>
              <span className="text-xs text-slate-400 font-semibold">Track client order statuses and advance packaging steps</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmerOrders.length === 0 ? (
                <div className="col-span-2 bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
                  No order requests logged yet.
                </div>
              ) : (
                farmerOrders.map((order) => {
                  const farmerItems = order.items.filter(item => item.farmerName === user.name);
                  const farmerSubtotal = farmerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">ORDER ID</span>
                            <span className="text-xs font-bold text-slate-750">{order.id}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : order.status === 'Out for Delivery'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700 animate-pulse-soft'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order items lists */}
                        <div className="border-t border-slate-50 pt-3 space-y-2">
                          {farmerItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-semibold text-slate-655">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="text-slate-800">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-50 mt-4">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                          <span>Subtotal Earnings</span>
                          <span className="text-sm font-extrabold text-farm-600">₹{farmerSubtotal}</span>
                        </div>

                        {/* Action controllers */}
                        {order.status !== 'Delivered' && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {order.status === 'Placed' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Harvesting')}
                                className="col-span-2 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs text-center transition-colors"
                              >
                                Accept & Start Harvesting
                              </button>
                            )}
                            {order.status === 'Harvesting' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Ready to Dispatch')}
                                className="col-span-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs text-center transition-colors"
                              >
                                Mark Ready to Dispatch
                              </button>
                            )}
                            {order.status === 'Ready to Dispatch' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                className="col-span-2 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs text-center transition-colors"
                              >
                                Out for Delivery
                              </button>
                            )}
                            {order.status === 'Out for Delivery' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                className="col-span-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs text-center transition-colors"
                              >
                                Confirm Delivered
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Edit Product Modal */}
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
                <h3 className="font-display font-black text-slate-800 text-sm">Edit Crop Details</h3>
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
                  <label className="block text-[9px] font-black text-slate-455 uppercase tracking-wider pl-1">Product Image URL</label>
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  />
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
                    className="px-4 py-2 border hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-655"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs"
                  >
                    Update Harvest
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
export default FarmerDashboard;
