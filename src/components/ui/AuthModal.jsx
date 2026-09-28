import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mail, Lock, User, Sprout, ShoppingBag, 
  ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, MapPin, Building2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, signup } = useAuth();
  
  // Tab state
  const activeTab = authModalTab; // 'login' or 'register'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific states
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' or 'farmer'
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!authModalOpen) return null;

  const handleTabSwitch = (tab) => {
    setAuthModalTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleQuickDemo = async (demoType) => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (demoType === 'customer') {
      setEmail('rohan@gmail.com');
      setPassword('password123');
      setLoading(true);
      const res = await login('rohan@gmail.com', 'password123', 'customer');
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } else if (demoType === 'farmer') {
      setEmail('ramesh@anugufarms.com');
      setPassword('password123');
      setLoading(true);
      const res = await login('ramesh@anugufarms.com', 'password123', 'farmer');
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMessage('Full name, email, and password are required.');
      return;
    }

    if (selectedRole === 'farmer' && (!farmName || !farmLocation)) {
      setErrorMessage('Farmers must provide a Farm Name and Farm Location.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    const farmDetails = {
      farm_name: farmName,
      location: farmLocation,
      farm_location: farmLocation
    };

    const res = await signup(fullName, email, password, selectedRole, farmDetails);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 my-auto"
        >
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-farm-900 via-farm-800 to-emerald-900 p-6 text-white relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-farm-500/30 p-2 rounded-xl border border-white/10">
                <Sprout className="w-5 h-5 text-emerald-300 fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">FarmFresh Direct Trade</span>
            </div>
            
            <h3 className="text-xl font-display font-black text-white">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join FarmFresh Community'}
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1 font-medium">
              {activeTab === 'login' 
                ? 'Sign in to manage orders & browse farm harvests' 
                : 'Connect directly with family farming networks'}
            </p>

            {/* Segmented Tab Headers */}
            <div className="flex bg-slate-950/40 p-1 rounded-xl mt-5 border border-white/10">
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-6 space-y-5">

            {/* Error Message Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 font-semibold"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-700 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* 1-Click Demo Quick Logins */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    ⚡ 1-Click Instant Demo Credentials
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('customer')}
                      disabled={loading}
                      className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-farm-500 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-farm-600" />
                      <span>Demo Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('farmer')}
                      disabled={loading}
                      className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-amber-500 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <Sprout className="w-3.5 h-3.5 text-amber-600" />
                      <span>Demo Farmer</span>
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. rohan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-semibold text-slate-800 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-semibold text-slate-800 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: CREATE ACCOUNT FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* Segmented Role Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Choose Account Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedRole === 'customer'
                          ? 'bg-white text-farm-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Produce</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('farmer')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedRole === 'farmer'
                          ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Sell Harvest</span>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahithi Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-semibold text-slate-800 transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="sahithi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-semibold text-slate-800 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Password (min 6 chars)</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-farm-500 focus:bg-white font-semibold text-slate-800 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Conditional Inputs for Farmer Role */}
                {selectedRole === 'farmer' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2 border-t border-slate-100"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-800 block flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" /> Farm / Producer Name
                      </label>
                      <input
                        type="text"
                        required={selectedRole === 'farmer'}
                        placeholder="e.g. Anugu Organic Farms"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-semibold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-amber-800 block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> Farm Location
                      </label>
                      <input
                        type="text"
                        required={selectedRole === 'farmer'}
                        placeholder="e.g. Chittoor, Andhra Pradesh"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-semibold text-slate-800 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    selectedRole === 'farmer'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-farm-600 hover:bg-farm-700'
                  }`}
                >
                  {loading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Register as {selectedRole === 'farmer' ? 'Farmer' : 'Customer'}</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-semibold">
              🔒 SSL Encrypted & Secure Multi-Tenant Authentication
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
