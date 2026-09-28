import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid, Search, X, Landmark, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ui/ProductCard';

export const Products = () => {
  const { globalProducts } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [maxPrice, setMaxPrice] = useState(350);
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showReddyOnly, setShowReddyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination limit
  const [visibleCount, setVisibleCount] = useState(6);

  // Categories list
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Spices & Turmeric', name: 'Turmeric & Spices' },
    { id: 'Fruits', name: 'Seasonal Mangoes' },
    { id: 'Grains', name: 'Rice & Grains' },
    { id: 'Dals & Pulses', name: 'Dals & Lentils' }
  ];

  // Update states if query parameters change
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Reset pagination limit when filters or sorting change
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, searchQuery, maxPrice, showOrganicOnly, showReddyOnly, sortBy]);

  // Handle category filter click
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(prev => {
      if (catId === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', catId);
      }
      return prev;
    });
  };

  // Handle text search change
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery.trim()) {
        prev.set('search', searchQuery.trim());
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  // Clear all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(350);
    setShowOrganicOnly(false);
    setShowReddyOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = globalProducts.filter((product) => {
    // 1. Text search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchFarmer = product.farmer?.name?.toLowerCase().includes(q) || product.farmer?.farmName?.toLowerCase().includes(q) || false;
      const matchCategory = product.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchFarmer && !matchCategory) return false;
    }

    // 2. Category match
    if (selectedCategory !== 'all') {
      if (product.category !== selectedCategory) return false;
    }

    // 3. Price limit
    if (product.price > maxPrice) return false;

    // 4. Organic filter
    if (showOrganicOnly && !product.organic) return false;

    // 5. Family Farm filter
    if (showReddyOnly && product.farmer?.farmName !== 'Reddy Organic Farms') return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // Popular
  });

  const slicedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Search & Statistics Ribbon */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-slate-800">Fresh Produce Shop</h2>
          <span className="text-xs text-slate-400 font-medium">Showing {filteredProducts.length} seasonal items</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Text Search inside Page */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search in store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs w-full sm:w-56 focus:outline-none focus:border-farm-500 font-semibold bg-slate-50 focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 rounded-xl p-2 text-xs font-bold bg-white focus:outline-none focus:border-farm-500"
          >
            <option value="popular">Sort by: Popular</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar (Hidden on mobile) */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-farm-600" /> Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-farm-50 text-farm-800 font-bold border-l-4 border-farm-500 pl-4'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider">Price Range</span>
              <span className="text-farm-600">₹0 - ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="80"
              max="350"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-farm-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Custom Switches */}
          <div className="space-y-3 pt-4 border-t border-slate-50">
            
            {/* Organic Switch */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800">Organic Certified</span>
              <input
                type="checkbox"
                checked={showOrganicOnly}
                onChange={(e) => setShowOrganicOnly(e.target.checked)}
                className="w-4 h-4 rounded text-farm-600 accent-farm-600"
              />
            </label>

            {/* Reddy Farms Switch */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-farm-600" /> Reddy family farms
              </span>
              <input
                type="checkbox"
                checked={showReddyOnly}
                onChange={(e) => setShowReddyOnly(e.target.checked)}
                className="w-4 h-4 rounded text-farm-600 accent-farm-600"
              />
            </label>

          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
              <div className="bg-slate-50 inline-flex p-4 rounded-full text-slate-400">
                <Grid className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Fresh Produce Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your selected filters. Try clearing your settings or lowering price limits.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-farm-600 text-white rounded-xl text-xs font-bold hover:bg-farm-700 transition-colors shadow cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Responsive Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {slicedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Load More Pagination */}
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center pt-4">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-2xl text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    <span>Load More Products</span>
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Slide-over Menu */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay background */}
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40"
          />

          <div className="relative bg-white w-80 max-w-[85vw] ml-auto h-full flex flex-col p-6 shadow-2xl justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  Filter Store
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Categories list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        selectedCategory === cat.id
                          ? 'bg-farm-600 text-white border-farm-600'
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range selector */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase">Max Price</span>
                  <span className="text-farm-600">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="350"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-farm-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-600">100% Certified Organic</span>
                  <input
                    type="checkbox"
                    checked={showOrganicOnly}
                    onChange={(e) => setShowOrganicOnly(e.target.checked)}
                    className="w-4.5 h-4.5 accent-farm-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-600">Reddy Family Farms</span>
                  <input
                    type="checkbox"
                    checked={showReddyOnly}
                    onChange={(e) => setShowReddyOnly(e.target.checked)}
                    className="w-4.5 h-4.5 accent-farm-600 rounded"
                  />
                </label>
              </div>

            </div>

            <div className="space-y-2 pt-6 border-t border-slate-100">
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-farm-600 text-white font-bold text-xs rounded-xl hover:bg-farm-700 transition-colors shadow cursor-pointer"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default Products;
