import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Wallet, ShoppingBag, 
  Heart, LogOut, Eye, PlusCircle, Trash2, Home, 
  Briefcase, Landmark, ShieldCheck, Plus, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FarmerDashboard } from '../components/dashboard/FarmerDashboard';

export const Profile = () => {
  const { 
    user, role, orders, wishlist, addresses, logout, 
    addAddress, removeAddress, toggleWishlist, globalProducts 
  } = useAuth();
  
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Active Dashboard Section
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, addresses, wishlist

  // Local state edit fields (Profile)
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedMsg, setSavedMsg] = useState(false);

  // Address Form fields
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState('Home'); // Home, Work, Other
  const [newAddressText, setNewAddressText] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block border">
          <User className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">Please sign in to view your dashboard</h3>
        <Link to="/login" className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white rounded-xl text-xs font-bold inline-block shadow">
          Sign In
        </Link>
      </div>
    );
  }

  // If logged in as a partner farmer, show the Farmer dashboard instead
  if (role === 'farmer') {
    return (
      <div className="pb-12">
        <FarmerDashboard />
      </div>
    );
  }

  // Filter orders placed by this customer
  const customerOrders = orders.filter((ord) => ord.customerId === user.id);

  // Filter wishlisted products details
  const wishlistedProducts = globalProducts.filter((prod) => wishlist.includes(prod.id));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    user.name = name;
    user.phone = phone;
    localStorage.setItem('ff_user', JSON.stringify(user));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    addAddress(newLabel, newAddressText.trim());
    setNewAddressText('');
    setShowAddressForm(false);
  };

  const handleAddTestBalance = () => {
    user.walletBalance = (user.walletBalance || 0) + 500;
    localStorage.setItem('ff_user', JSON.stringify(user));
    alert('₹500 test funds added to your FarmFresh Wallet!');
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarMenu = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: customerOrders.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, badge: addresses.length },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: wishlist.length },
  ];

  return (
    <div className="pb-16 space-y-6">
      
      {/* Welcome Ribbon Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-farm-50 text-farm-600 p-3.5 rounded-full border border-farm-100 relative">
            <User className="w-8 h-8" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-slate-800">Hello, {user.name}</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Portal</span>
          </div>
        </div>

        {/* Quick Balance indicator */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight block">Wallet Balance</span>
              <span className="text-base font-extrabold text-slate-800">₹{user.walletBalance || 0}</span>
            </div>
            <button
              onClick={handleAddTestBalance}
              className="bg-farm-600 hover:bg-farm-700 text-white p-1 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Add ₹500 test credits"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout (Sidebar navigation + Main content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Column (lg:col-span-3) */}
        <nav className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2 block">
              Manage Account
            </span>
            <div className="space-y-1">
              {sidebarMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-farm-600 text-white shadow-md' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-farm-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Column (lg:col-span-9) */}
        <main className="lg:col-span-9 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 min-h-[420px]">
          <AnimatePresence mode="wait">
            
            {/* 1. Profile Section */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black text-slate-800">My Profile details</h3>
                  <p className="text-xs text-slate-400 font-medium">Update name, contact parameters and configuration settings</p>
                </div>

                {savedMsg && (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-center text-xs font-semibold border border-emerald-100">
                    Profile details updated successfully!
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-2xl bg-slate-100 text-slate-450 cursor-not-allowed"
                      title="Email address cannot be changed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wider pl-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:border-farm-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* 2. My Orders Section */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black text-slate-800">My Orders history</h3>
                  <p className="text-xs text-slate-400 font-medium">Verify timelines, totals and dispatch parameters</p>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-350 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">No order placements found. Visit store to buy crops!</p>
                    <Link
                      to="/products"
                      className="px-5 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-xl text-xs inline-block shadow-xs"
                    >
                      Shop Produce
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-slate-150 rounded-2xl p-5 hover:shadow-xs transition-all space-y-4"
                      >
                        <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-3 gap-2 flex-wrap">
                          <div>
                            <span className="text-[9px] text-slate-400 font-black block uppercase">ORDER ID</span>
                            <span className="font-extrabold text-slate-750">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-black block uppercase text-right">STATUS</span>
                            <span className="font-bold text-farm-700 bg-farm-50 px-2 py-0.5 rounded-lg text-[10px] uppercase">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-600 font-medium">
                              <span>{item.name} x{item.quantity}</span>
                              <span className="font-bold text-slate-850">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Summary line */}
                        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold">Total Paid</span>
                            <span className="text-sm font-extrabold text-slate-850">₹{order.grandTotal}</span>
                          </div>
                          <Link
                            to="/orders"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 font-bold rounded-xl transition-all"
                          >
                            <span>Track Order</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. Saved Addresses Section */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-display font-black text-slate-800">Saved Addresses</h3>
                    <p className="text-xs text-slate-400 font-medium">Manage shipping and billing delivery endpoints</p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="inline-flex items-center gap-1 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                {/* Add address Form */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddAddress}
                      className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 overflow-hidden"
                    >
                      <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">New Address Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div>
                          <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Label Tag</label>
                          <select
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full text-xs font-bold p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
                          >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Full Shipping Address</label>
                          <input
                            type="text"
                            required
                            placeholder="Apartment, Street Name, Sector, City, PIN"
                            value={newAddressText}
                            onChange={(e) => setNewAddressText(e.target.value)}
                            className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-farm-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-3 py-1.5 border hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-farm-600 text-white font-bold rounded-lg text-[10px]"
                        >
                          Save Address
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Addresses list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border border-slate-150 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {addr.label === 'Home' && <Home className="w-4 h-4 text-farm-600" />}
                        {addr.label === 'Office' && <Briefcase className="w-4 h-4 text-farm-600" />}
                        {addr.label !== 'Home' && addr.label !== 'Office' && <MapPin className="w-4 h-4 text-farm-600" />}
                        <span className="text-xs font-extrabold text-slate-800">{addr.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed pr-6">
                        {addr.address}
                      </p>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="absolute top-4 right-4 text-slate-350 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. Wishlist Section */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-display font-black text-slate-800">My Wishlist</h3>
                  <p className="text-xs text-slate-400 font-medium">Keep track of your favorite organic harvests</p>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Heart className="w-12 h-12 text-slate-350 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Your wishlist is empty. Browse products and click details to bookmark!</p>
                    <Link
                      to="/products"
                      className="px-5 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-xl text-xs inline-block shadow-xs"
                    >
                      Browse Store
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistedProducts.map((prod) => {
                      const inCart = cartItems.some(i => i.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          className="border border-slate-150 rounded-2xl p-4 flex gap-4 hover:shadow-xs transition-all relative"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-20 h-20 object-cover rounded-xl border flex-shrink-0"
                          />
                          <div className="flex flex-col justify-between flex-grow min-w-0 pr-6">
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-farm-600">
                                <Link to={`/product/${prod.id}`}>{prod.name}</Link>
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold">{prod.unit}</span>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="font-extrabold text-xs text-slate-900">₹{prod.price}</span>
                                {prod.originalPrice && (
                                  <span className="text-[9px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Action to Cart */}
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black text-center shadow-xs cursor-pointer w-28 transition-colors ${
                                inCart 
                                  ? 'bg-farm-50 text-farm-800 border border-farm-200' 
                                  : 'bg-farm-600 hover:bg-farm-700 text-white'
                              }`}
                            >
                              {inCart ? 'Added in Cart' : 'Add to Cart'}
                            </button>
                          </div>

                          {/* Quick delete wishlist */}
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className="absolute top-4 right-4 text-slate-350 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove from wishlist"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>

    </div>
  );
};

export default Profile;
