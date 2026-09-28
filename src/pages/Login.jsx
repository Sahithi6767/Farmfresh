import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Leaf, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer or farmer
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation and forgot password states
  const [error, setError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Save remember me status (simulated)
    if (rememberMe) {
      localStorage.setItem('ff_remembered_email', email);
    } else {
      localStorage.removeItem('ff_remembered_email');
    }

    const res = await login(email, password, role);
    if (res.success) {
      navigate(role === 'farmer' ? '/profile' : '/');
    } else {
      setError(res.message || 'Login failed.');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess('');

    if (!forgotEmail) {
      alert('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setForgotSuccess(`Password recovery email sent to ${forgotEmail}! Check your inbox.`);
    setForgotEmail('');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
    }, 4000);
  };

  const handleQuickLogin = (type) => {
    if (type === 'customer') {
      setEmail('rohan@gmail.com');
      setPassword('password123');
      setRole('customer');
    } else {
      setEmail('thirupathi@reddyfarms.com');
      setPassword('password123');
      setRole('farmer');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      {/* Modern Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-8 space-y-6 relative"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-farm-600 text-white p-3 rounded-2xl shadow-md inline-block">
            <Leaf className="w-6 h-6 fill-current animate-float" />
          </div>
          <h2 className="text-2xl font-display font-black text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-semibold">Access your farm direct trade dashboard</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-650 border border-red-100 text-xs font-semibold p-3.5 rounded-2xl text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Customer / Farmer Tabs */}
          <div className="flex bg-slate-50 border border-slate-200 p-1.5 rounded-2xl justify-between gap-1">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                role === 'customer' 
                  ? 'bg-farm-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                role === 'farmer' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Partner Farmer
            </button>
          </div>

          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. rohan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password row */}
          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-550 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-farm-600 accent-farm-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-farm-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors"
          >
            Access Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-black text-slate-450 uppercase tracking-widest">
            or continue with
          </span>
        </div>

        {/* Google Login button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            alert('Google authentication is fully simulated. Logging in with test customer profile!');
            handleQuickLogin('customer');
          }}
          className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.24-3.12C18.297.89 15.428 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.887 11.57-11.777 0-.795-.085-1.402-.19-1.938H12.24z"
            />
          </svg>
          <span>Sign In with Google</span>
        </motion.button>

        {/* Signup redirection */}
        <div className="text-center text-xs font-bold text-slate-550 pt-2">
          New to FarmFresh?{' '}
          <Link to="/signup" className="text-farm-600 hover:underline">
            Register here
          </Link>
        </div>

        {/* Quick test credentials */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
          <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider text-center">
            Reviewer Tester Account
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-xl text-[10px] font-black cursor-pointer transition-all"
            >
              Test Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('farmer')}
              className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-850 border border-amber-100 rounded-xl text-[10px] font-black cursor-pointer transition-all"
            >
              Test Farmer
            </button>
          </div>
        </div>

      </motion.div>

      {/* Forgot Password Modal (Simulated modal block) */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-display font-black text-slate-800 text-sm">Recover Password</h3>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <XIcon />
                </button>
              </div>

              {forgotSuccess ? (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold p-4 rounded-2xl text-center space-y-2 flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 animate-pulse-soft" />
                  <span>{forgotSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    Enter the email associated with your profile, and we will send a password recovery token link.
                  </p>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rohan@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-farm-500 bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                  >
                    Send Recovery Email
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal mini close X icon
const XIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Login;
