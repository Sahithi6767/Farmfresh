import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Tractor, Truck, 
  MapPin, Apple, Wheat, Sprout, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ui/ProductCard';

export const Home = () => {
  const { globalProducts } = useAuth();
  const navigate = useNavigate();

  // Filter out bestsellers
  const bestSellers = globalProducts.filter(p => p.bestseller).slice(0, 4);

  // Find the family farm products for spotlight
  const familyFarmProducts = globalProducts.filter(p => p.farmer.farmName === 'Reddy Organic Farms').slice(0, 2);

  const categories = [
    { name: 'Spices & Turmeric', icon: Sprout, color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Turmeric & Spices' },
    { name: 'Fruits', icon: Apple, color: 'bg-red-50 text-red-600 border-red-100', label: 'Seasonal Mangoes' },
    { name: 'Grains', icon: Wheat, color: 'bg-yellow-50 text-yellow-700 border-yellow-100', label: 'Rice & Grains' },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-farm-50 via-farm-100/50 to-emerald-50 border border-farm-100 p-8 md:p-12 lg:p-16 flex flex-col-reverse lg:flex-row items-center gap-10">
        
        {/* Decorative Floating Leaves */}
        <div className="absolute top-10 left-10 text-farm-300 animate-float opacity-30 pointer-events-none hidden md:block">
          <Sprout className="w-12 h-12" />
        </div>

        {/* Hero Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-farm-200/60 text-farm-800 text-xs font-black uppercase tracking-wider">
            🌿 Direct Farm Trade — Storable & Fresh
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 leading-tight">
            Farm Harvested, <br />
            <span className="text-farm-600">Delivered to You.</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm md:text-lg max-w-xl mx-auto lg:mx-0">
            Reddy Organic Farms in Bhupathipur, Jagtial grows premium turmeric, seasonal mangoes and high-quality rice — shipped directly to your door without brokers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto text-center bg-farm-600 hover:bg-farm-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Order Fresh Produce <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-2xl transition-colors cursor-pointer"
            >
              Read Farm Stories
            </Link>
          </div>
        </div>

        {/* Hero Image / Badge */}
        <div className="flex-1 flex justify-center relative z-10 w-full max-w-md lg:max-w-none">
          <div className="relative">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600"
              alt="Turmeric harvest from Reddy Farms"
              className="rounded-3xl shadow-xl w-full h-[320px] object-cover border border-white"
            />
            {/* Quick stats floating bubble */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
              <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">STORABLE ITEMS ONLY</span>
                <span className="text-sm font-bold text-slate-800">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Category Listings */}
      <section className="space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-display font-black text-slate-800">What We Grow & Sell</h2>
          <p className="text-xs text-slate-400 font-medium">Only storable, long-shelf-life products — guaranteed quality from Bhupathipur to your home</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white border border-slate-100 p-6 rounded-2xl text-center hover:shadow-md cursor-pointer transition-shadow space-y-3 flex flex-col items-center justify-center hover-gradient-border"
              >
                <div className={`p-4 rounded-2xl border ${cat.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-700 block">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Family Farm Spotlight */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-12 hidden lg:flex pointer-events-none">
          <Tractor className="w-80 h-80 text-emerald-500" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" /> Bhupathipur, Jagtial — Family Farm Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
              Reddy Organic Farms
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Nestled in the fertile lands of Jagtial, Telangana, Thirupathi Reddy's family has been farming for over 40 years on 25 acres of organic land. We grow only what travels well — turmeric, mangoes, and rice — items that hold their quality from farm to doorstep without refrigeration chains.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="text-xs text-slate-400 block font-medium">Farm Size</span>
                <span className="text-lg font-bold text-white">25 Acres</span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="text-xs text-slate-400 block font-medium">Method</span>
                <span className="text-lg font-bold text-white">Organic</span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="text-xs text-slate-400 block font-medium">Location</span>
                <span className="text-lg font-bold text-white">Jagtial, TG</span>
              </div>
            </div>
            <div>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs hover:underline"
              >
                Read Our Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Featured items from this farm */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {familyFarmProducts.map((prod) => (
              <div key={prod.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-3">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-32 object-cover rounded-xl"
                />
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-350">{prod.unit}</span>
                    <span className="text-xs font-extrabold text-emerald-300">₹{prod.price}</span>
                  </div>
                </div>
                <Link 
                  to={`/product/${prod.id}`}
                  className="block text-center w-full py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-bold hover:bg-slate-100"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Deals & Bestsellers */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-black text-slate-800">Deals of the Day</h2>
            <p className="text-xs text-slate-400 font-medium">Harvested fresh, priced for maximum value</p>
          </div>
          <Link 
            to="/products" 
            className="hidden sm:inline-flex items-center gap-1.5 text-farm-600 hover:text-farm-700 font-bold text-xs"
          >
            See All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Direct-to-Consumer Path Stepper */}
      <section className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 md:p-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-display font-black text-slate-800">Freshness in Hours, Not Days</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Standard supermarket chains take 5-7 days of storage. Our optimized logistics delivers produce fresh within hours of plucking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          <div className="space-y-3 text-center flex flex-col items-center">
            <div className="p-4 bg-white text-farm-600 border border-farm-200 rounded-2xl shadow-sm">
              <Tractor className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-800">1. Sustainable Harvest</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
              Farmers select prime ripe produce at sunrise using organic checks.
            </p>
          </div>

          <div className="space-y-3 text-center flex flex-col items-center">
            <div className="p-4 bg-white text-farm-600 border border-farm-200 rounded-2xl shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-800">2. Quality Cleaning</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
              Produce is washed in clean ozone water and sanitarily sorted.
            </p>
          </div>

          <div className="space-y-3 text-center flex flex-col items-center">
            <div className="p-4 bg-white text-farm-600 border border-farm-200 rounded-2xl shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-800">3. Packed & Dispatched</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
              Goods dispatched from Bhupathipur, Jagtial in airtight packaging preserving quality.
            </p>
          </div>

          <div className="space-y-3 text-center flex flex-col items-center">
            <div className="p-4 bg-white text-farm-600 border border-farm-200 rounded-2xl shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-800">4. Fresh at Doorstep</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
              Arrives at your home with farm-level temperature locking.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
export default Home;
