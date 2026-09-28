import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Search, MapPin, Menu, X, 
  Leaf, Settings, LogOut, ChevronRight, UserCheck, Sprout 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/ui/AuthModal';

export const RootLayout = ({ children }) => {
  const { cartCount, cartTotal } = useCart();
  const { user, role, switchRole, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleRole = () => {
    const targetRole = role === 'customer' ? 'farmer' : 'customer';
    switchRole(targetRole);
    navigate(targetRole === 'farmer' ? '/profile' : '/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop Produce', path: '/products' },
    { label: 'Our Story', path: '/about' },
    { label: 'Get in Touch', path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      {/* Auth Modal Container */}
      <AuthModal />
      
      {/* Top Banner Alert */}
      <div className="bg-farm-950 text-emerald-200 text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
        <Leaf className="w-3.5 h-3.5 fill-current animate-pulse-soft" />
        <span>Direct-from-farm prices! <strong>Anugu & Reddy Organic Farms</strong> — Turmeric, Mangoes & Rice.</span>
      </div>

      {/* Navbar Container */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-farm-600 text-white p-2 rounded-2xl shadow-md">
              <Leaf className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-slate-800 flex items-center gap-0.5">
                Farm<span className="text-farm-600">Fresh</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block -mt-1.5">Direct Trade</span>
            </div>
          </Link>

          {/* Location Badge (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 flex-shrink-0">
            <MapPin className="w-4 h-4 text-farm-600" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Delivering to</span>
              <span className="line-clamp-1 max-w-[150px]">{user ? user.address?.split(',')[0] || user.location || 'Bengaluru' : 'Select Location'}</span>
            </div>
          </div>

          {/* Search Box (Desktop & Tablet) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-md relative">
            <input
              type="text"
              placeholder="Search turmeric, mangoes, basmati rice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-farm-500 focus:bg-white font-medium transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </form>

          {/* Navigation & Controls */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-semibold text-sm transition-colors hover:text-farm-600 ${
                  location.pathname === item.path ? 'text-farm-600 font-bold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions panel */}
          <div className="flex items-center gap-3">
            
            {/* Dynamic Role Navigation Pill */}
            {user && user.role === 'farmer' ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleRole}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm transition-all border cursor-pointer ${
                  role === 'farmer' 
                    ? 'bg-amber-500 text-white border-amber-600' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Toggle between Marketplace and Farmer Dashboard"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Mode: {role === 'farmer' ? '🌾 Farmer Dashboard' : '🛒 Buyer Mode'}</span>
              </motion.button>
            ) : user && user.role === 'customer' ? (
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                title="Register your farm to sell harvest produce"
              >
                <Sprout className="w-3.5 h-3.5 text-amber-600" />
                <span>Become a Farmer</span>
              </button>
            ) : null}

            {/* Shopping Cart Pill (Customer view only) */}
            {role === 'customer' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 bg-farm-600 hover:bg-farm-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md cursor-pointer transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-amber-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-farm-600 shadow-sm animate-pulse-soft">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden sm:inline border-l border-emerald-400 pl-2">
                  {cartCount > 0 ? `₹${cartTotal}` : 'Empty'}
                </span>
              </motion.button>
            )}

            {/* User Account Controls */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3 py-1.5 transition-all text-slate-700 flex items-center gap-2 shadow-2xs"
                  title="Profile & Dashboard"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-farm-100 text-farm-700 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{user.name.split(' ')[0]}</span>
                    <span className="text-[9px] font-semibold text-slate-400 block uppercase tracking-tighter">
                      {user.role === 'farmer' ? '🌾 Farmer' : '🛒 Customer'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors text-slate-400 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white px-4 pb-4 border-b border-slate-100">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search turmeric, mangoes, rice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Slide-out Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white z-50 shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-5 h-5 text-farm-600 fill-current" />
                    <span className="font-display font-bold text-lg text-slate-800">FarmFresh Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between font-semibold text-base py-2 border-b border-slate-50 hover:text-farm-600 transition-colors ${
                        location.pathname === item.path ? 'text-farm-600 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  ))}
                  
                  {user && (
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-semibold text-base py-2 border-b border-slate-50 text-slate-600 hover:text-farm-600 transition-colors"
                    >
                      <span>Track Orders</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Footer with Role Toggle */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    toggleRole();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm border cursor-pointer ${
                    role === 'farmer' 
                      ? 'bg-amber-500 text-white border-amber-600' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Toggle Role: {role === 'farmer' ? 'Farmer Mode' : 'Customer Mode'}</span>
                </button>

                {user ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">Logged in as {user.name}</span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-farm-600 p-2 rounded-xl">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span className="font-display font-black text-xl">FarmFresh</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Connecting urban tables to the Reddy family's 25-acre organic farm in Bhupathipur, Jagtial. Direct-trade turmeric, mangoes, and rice — no middlemen.
            </p>
            <div className="text-[10px] text-slate-500 font-bold">
              PORTFOLIO PROJECT — THIRUPATHI REDDY FAMILY FARM, TELANGANA
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Spices+%26+Turmeric" className="hover:text-white transition-colors">Turmeric & Spices</Link></li>
              <li><Link to="/products?category=Fruits" className="hover:text-white transition-colors">Seasonal Mangoes</Link></li>
              <li><Link to="/products?category=Grains" className="hover:text-white transition-colors">Rice & Grains</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Farming Roots</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Collaborate with Us</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">User Dashboard</Link></li>
              <li><span onClick={toggleRole} className="hover:text-white transition-colors cursor-pointer font-semibold text-farm-400">Test Farmer Dashboard</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400">Receive harvest schedules and eco farming insights.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 w-full focus:outline-none focus:border-farm-500"
              />
              <button className="bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} FarmFresh Inc. Handcrafted for family agricultural trade.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors">Farmer Guidelines</span>
          </div>
        </div>
      </footer>

      {/* Floating cart button for mobile customer view */}
      {role === 'customer' && cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 bg-farm-600 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 animate-float" />
            <span className="text-xs">₹{cartTotal} ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
          </motion.button>
        </div>
      )}

    </div>
  );
};
export default RootLayout;
