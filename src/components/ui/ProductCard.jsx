import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (quantityInCart === 0) {
      addToCart(product, 1);
    }
    navigate('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative flex flex-col h-full hover-gradient-border"
    >
      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-slate-50 pt-[80%] relative">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Details Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <Link
          to={`/product/${product.id}`}
          className="font-display font-bold text-slate-800 text-base mb-1 hover:text-farm-600 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Unit */}
        <span className="text-xs text-slate-450 mb-2 block font-semibold">{product.unit}</span>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-xs gap-0.5">
            <Star className="w-3 h-3 fill-current" />
            {product.rating}
          </div>
          <span className="text-xs text-slate-400 font-semibold">({product.reviewsCount})</span>
        </div>

        {/* Price display: MRP only */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-bold mr-1">MRP:</span>
            <span className="text-lg font-black text-slate-900">₹{product.price}</span>
          </div>
          <span className="text-[9px] text-slate-400 block font-semibold">Incl. all taxes</span>
        </div>

        {/* Quantity selector, Add to cart & Buy now controls */}
        <div className="mt-auto space-y-2.5 pt-3 border-t border-slate-50">
          
          {/* Row 1: Quantity Selector Pill & Add to Cart button */}
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => quantityInCart > 0 && updateQuantity(product.id, quantityInCart - 1)}
                disabled={quantityInCart === 0}
                className={`px-2.5 py-2 transition-colors cursor-pointer ${
                  quantityInCart === 0 ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 font-bold text-xs text-slate-700 min-w-4 text-center">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="px-2.5 py-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(product, 1)}
              className={`flex-1 text-center font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer bg-farm-600 hover:bg-farm-700 text-white border border-farm-600`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{quantityInCart > 0 ? `Added (${quantityInCart})` : 'Add to Cart'}</span>
            </motion.button>
          </div>

          {/* Row 2: Buy Now button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
