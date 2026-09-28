import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Leaf, Tractor, MapPin, AlignLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer or farmer
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Farmer specific states
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [farmStory, setFarmStory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all basic fields');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'farmer' && (!farmName || !location)) {
      setError('Please fill in your Farm Name and Location');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and guidelines');
      return;
    }

    const farmDetails = role === 'farmer' ? {
      farm_name: farmName,
      location: location,
      farm_location: location,
      farm_story: farmStory,
      story: farmStory,
      phone: '+91 99999 88888'
    } : {};

    const res = await signup(name, email, password, role, farmDetails);
    if (res.success) {
      navigate(role === 'farmer' ? '/profile' : '/');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      {/* Modern Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-8 space-y-6"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-farm-600 text-white p-3 rounded-2xl shadow-md inline-block">
            <Leaf className="w-6 h-6 fill-current animate-float" />
          </div>
          <h2 className="text-2xl font-display font-black text-slate-800">Create Account</h2>
          <p className="text-xs text-slate-400 font-semibold">Join the direct-trade organic market</p>
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

          {/* Full Name field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
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

          {/* Farmer Specific Fields (Dynamic anim) */}
          <AnimatePresence>
            {role === 'farmer' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden border-l-4 border-amber-500 pl-3 py-1.5"
              >
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                    Farm / Orchard Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Reddy Organic Farms"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl"
                    />
                    <Tractor className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                    Farm Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Jagtial, Telangana"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                    Describe your farm crops
                  </label>
                  <div className="relative">
                    <textarea
                      rows="2"
                      placeholder="Tell customers about your soil, crops, and methods..."
                      value={farmStory}
                      onChange={(e) => setFarmStory(e.target.value)}
                      className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl"
                    ></textarea>
                    <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3.5 top-5 -translate-y-1/2" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
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

          {/* Confirm Password field */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs font-semibold pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-farm-500 focus:bg-white rounded-2xl transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Policies validation checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs font-bold text-slate-550 select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-farm-600 accent-farm-600 mt-0.5 cursor-pointer"
              />
              <span className="leading-tight">
                I agree to the FarmFresh Guidelines &amp; Direct Trade Policies.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-black text-slate-450 uppercase tracking-widest">
            or register with
          </span>
        </div>

        {/* Google Signup button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            alert('Google authentication is simulated. Registering a test customer profile!');
            signup('Google Test User', 'google.user@gmail.com', 'password123', 'customer');
            navigate('/');
          }}
          className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.24-3.12C18.297.89 15.428 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.887 11.57-11.777 0-.795-.085-1.402-.19-1.938H12.24z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </motion.button>

        {/* Login redirection */}
        <div className="text-center text-xs font-bold text-slate-550 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-farm-600 hover:underline">
            Sign In here
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Signup;
