import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Plus, Minus, ArrowRight, Activity, 
  Truck, MapPin, Lock, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ui/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const { globalProducts } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Find product by id
  useEffect(() => {
    const found = globalProducts.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setQuantity(1); // reset local quantity state when changing products
    }
  }, [id, globalProducts]);

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-farm-600 mx-auto"></div>
        <h3 className="text-base font-bold text-slate-600">Loading Farm Produce...</h3>
        <Link to="/products" className="text-farm-600 font-bold text-xs hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Cart state for this product
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Find related products in the same category
  const relatedProducts = globalProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Breadcrumbs & Back Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-100 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to store listing
        </button>
        <div className="text-slate-400 font-semibold">
          <Link to="/" className="hover:text-farm-600">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link to="/products" className="hover:text-farm-600">Shop Produce</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-500 font-bold">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Large Product Image Frame (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm pt-[90%]">
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Column 2: Center Details Panel (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Title */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-farm-700 bg-farm-50 border border-farm-100 px-2 py-0.5 rounded-md inline-block">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-black text-slate-800 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Block: Single MRP Price Only */}
          <div className="border-t border-b border-slate-100 py-4 space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400 font-bold">MRP:</span>
              <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
            </div>
            <span className="text-xs text-slate-405 block font-semibold">{product.unit} pack size</span>
            <span className="text-[10px] text-slate-400 block font-semibold">Inclusive of all taxes</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Highlights</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>
        </div>

        {/* Column 3: "Buy Box" Card (lg:col-span-3) */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-slate-800">₹{product.price * quantity}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                In Stock
              </span>
            </div>
            <span className="text-xs text-slate-400 font-semibold block">Total checkout estimation</span>
          </div>

          {/* Shipping detail box */}
          <div className="space-y-3 pt-2 text-xs font-semibold text-slate-600 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-farm-600 mt-0.5" />
              <div>
                <span className="block text-slate-800">Fresh Dispatch</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Direct from Bhupathipur, Jagtial
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-farm-600 mt-0.5" />
              <div>
                <span className="block text-slate-800">Delivery Timeline</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Arrives in 12-16 hours of dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Select Quantity
            </label>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl overflow-hidden shadow-xs p-1.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 text-slate-650" />
              </button>
              <span className="px-3 font-bold text-sm text-slate-800">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-650" />
              </button>
            </div>
            {quantityInCart > 0 && (
              <span className="text-[10px] text-farm-600 font-bold block text-center mt-1">
                ({quantityInCart} currently in your shopping cart)
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full text-center bg-farm-600 hover:bg-farm-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{added ? 'Added to Basket!' : 'Add to Basket'}</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Buy Now Direct</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Secure transaction indicator */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-100">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure direct trade payment</span>
          </div>
        </aside>

      </div>

      {/* 2. Nutritional Profile fact sheet */}
      {product.nutrients && (
        <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 opacity-10 flex items-center pr-6 hidden md:flex pointer-events-none">
            <Activity className="w-36 h-36" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Nutritional Profile Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {Object.entries(product.nutrients).map(([key, value]) => (
                <div key={key} className="bg-white/10 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-350 block capitalize font-black tracking-tight">{key}</span>
                  <span className="text-sm font-bold text-emerald-300 mt-0.5 block">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Related Products Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-black text-slate-800 text-xl">Customers Also Sourced</h3>
            <Link 
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-farm-600 hover:text-farm-700 font-bold text-xs flex items-center gap-1"
            >
              See All Category Items <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
