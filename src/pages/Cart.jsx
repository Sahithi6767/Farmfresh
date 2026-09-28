import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, Plus, Minus, MapPin, 
  Wallet, ShieldCheck, CheckCircle2, Leaf, Heart 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, addExternalOrder } = useAuth();
  const navigate = useNavigate();

  const [farmerTip, setFarmerTip] = useState(10); // default social contribution tip
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Inject Razorpay checkout.js dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Delivery Calculations (Zepto/Blinkit style)
  const deliveryFee = cartTotal > 250 ? 0 : 39;
  const handlingFee = 5;
  const grandTotal = cartTotal + deliveryFee + handlingFee + farmerTip;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingCheckout(true);
    
    // Dynamically obtain token if missing for default Rohan Sharma customer
    let token = localStorage.getItem('ff_token');
    if (!token && user.email === 'rohan@gmail.com') {
      try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'rohan@gmail.com', password: 'password123', role: 'customer' })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          token = loginData.token;
          localStorage.setItem('ff_token', token);
          localStorage.setItem('ff_user', JSON.stringify(loginData.user));
        }
      } catch (err) {
        console.error("Auto-login error:", err);
      }
    }

    if (!token) {
      alert("Session expired or unauthorized. Please log in first.");
      setLoadingCheckout(false);
      navigate('/login');
      return;
    }

    try {
      // Synchronize client-side cart items to backend database first
      const getCartRes = await fetch('http://localhost:5000/api/cart/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!getCartRes.ok) {
        const errorText = await getCartRes.text();
        alert(`Backend Cart Sync Error: ${errorText}`);
        setLoadingCheckout(false);
        return;
      }

      const backendItems = await getCartRes.json();
      for (const item of backendItems) {
        await fetch(`http://localhost:5000/api/cart/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      for (const item of cartItems) {
        const addCartRes = await fetch('http://localhost:5000/api/cart/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.quantity
          })
        });
        if (!addCartRes.ok) {
          const addCartText = await addCartRes.text();
          alert(`Cart Sync Add Error: ${addCartText}`);
          setLoadingCheckout(false);
          return;
        }
      }

      // 1. Initiate order creation on backend
      const res = await fetch('http://localhost:5000/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deliveryFee: deliveryFee + handlingFee,
          farmerContribution: farmerTip
        })
      });

      if (!res.ok) {
        const orderText = await res.text();
        let message = 'Error creating Razorpay Order ID.';
        try {
          const orderJson = JSON.parse(orderText);
          message = orderJson.message || message;
        } catch (e) {
          message = orderText || message;
        }
        alert(message);
        setLoadingCheckout(false);
        return;
      }

      const orderData = await res.json();

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FarmFresh Store',
        description: 'Direct-Trade Harvest Order',
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            const verifyRes = await fetch('http://localhost:5000/api/payments/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: orderData.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                deliveryFee: deliveryFee + handlingFee,
                farmerContribution: farmerTip,
                address: user.address || 'Standard Delivery Address'
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.order) {
              // 4. Save order and clear cart
              addExternalOrder(verifyData.order);
              clearCart();
              setOrderSuccess(verifyData.order);
            } else {
              alert(verifyData.message || 'Payment signature verification failed.');
              setLoadingCheckout(false);
            }
          } catch (err) {
            alert('Payment verification connection failed.');
            setLoadingCheckout(false);
          }
        },
        prefill: {
          name: orderData.customer_name,
          email: orderData.customer_email,
          contact: orderData.customer_phone
        },
        theme: {
          color: '#059669' // FarmFresh theme color
        },
        modal: {
          ondismiss: function () {
            setLoadingCheckout(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (resp) {
        alert(`Payment failed: ${resp.error.description}`);
        setLoadingCheckout(false);
      });

      rzp.open();

    } catch (err) {
      alert('Network error connecting to payment gateway.');
      setLoadingCheckout(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-emerald-50 text-emerald-600 p-5 rounded-full inline-flex border border-emerald-100 shadow-md animate-pulse-soft"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800">Order Placed Successfully!</h2>
          <p className="text-xs text-slate-400 font-medium">Order ID: <strong className="text-slate-650">{orderSuccess.id}</strong></p>
          <p className="text-sm text-slate-500 font-medium">
            Your fresh harvest order has been routed to our partner farmers. Harvest starts shortly!
          </p>
        </div>

        {/* Order Details Brief */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfillment Timeline</h4>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 bg-farm-600 rounded-full animate-ping" />
            <span>Currently: Placed & Routing to Farmers</span>
          </div>
          {orderSuccess.transaction_id && (
            <div className="text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1">
              <span className="block text-[8px] text-slate-400 uppercase tracking-wider">Gateway transaction ID</span>
              <span className="font-mono text-slate-800">{orderSuccess.transaction_id}</span>
            </div>
          )}
          <p className="text-[11px] text-slate-400">
            A copy of this order has been updated in your profile. You can track harvesting progress in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-farm-600 hover:bg-farm-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            Track Order Progress
          </button>
          
          <a
            href={`http://localhost:5000/api/payments/receipt/${orderSuccess.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Print Receipt</span>
          </a>

          <button
            onClick={() => navigate('/products')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="bg-slate-50 p-6 rounded-full inline-flex text-slate-400 border border-slate-100">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-700">Your Basket is Empty</h3>
          <p className="text-xs text-slate-400">
            Looks like you haven't added any fresh farm produce to your cart yet.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-block bg-farm-600 hover:bg-farm-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-colors"
        >
          Browse Fresh Harvests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      <div>
        <h2 className="text-2xl font-display font-black text-slate-800">Checkout Basket</h2>
        <p className="text-xs text-slate-400 font-medium">Verify your items and delivery address</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cart Items ({cartItems.length})</h3>
            
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">{item.unit}</span>
                      <span className="text-[10px] text-farm-600 font-bold block mt-0.5">Farm: {item.farmerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Item controls */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-slate-500" />
                      </button>
                      <span className="px-2 font-bold text-xs text-slate-800 min-w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1.5 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-bold text-slate-850 text-sm block">₹{item.price * item.quantity}</span>
                      <span className="text-[9px] text-slate-400 font-semibold block">₹{item.price}/{item.unit.split(' ')[0]}</span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-350 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Impact Feature: Farmer Tip */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-xl text-farm-600 border border-emerald-100">
                <Heart className="w-5 h-5 fill-current animate-float" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-slate-800">Support Rural Family Farmers</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Add a voluntary farmer tip. 100% of this contribution is transferred directly to the farmers' accounts to support sustainable water irrigation and seed sourcing.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[0, 10, 20, 50].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setFarmerTip(tip)}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all border cursor-pointer ${
                    farmerTip === tip
                      ? 'bg-farm-600 text-white border-farm-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tip === 0 ? 'No Tip' : `₹${tip}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Details */}
        <div className="space-y-4">
          
          {/* Shipping Address Display */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-farm-600" /> Delivery Location
            </h4>
            <div className="text-xs font-semibold text-slate-600">
              {user ? (
                <div className="space-y-1">
                  <span className="font-bold text-slate-800">{user.name}</span>
                  <span className="block text-slate-500 leading-relaxed font-medium">{user.address}</span>
                  <span className="block text-slate-400 font-medium">Phone: {user.phone}</span>
                </div>
              ) : (
                <Link to="/login" className="text-farm-600 font-bold hover:underline">
                  Please log in to set delivery details.
                </Link>
              )}
            </div>
          </div>

          {/* Pricing Breakdown Sheet */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bill Summary</h4>
            
            <div className="space-y-2 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Items Total (MRP)</span>
                <span className="text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-farm-600 font-black">FREE <span className="line-through text-slate-400 ml-1">₹39</span></span>
                  ) : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Handling & Packaging charge</span>
                <span className="text-slate-800">₹{handlingFee}</span>
              </div>
              {farmerTip > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Farmer support contribution</span>
                  <span>₹{farmerTip}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Total Amount Pay</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Incl. GST & Taxes</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900">₹{grandTotal}</span>
            </div>

            {/* Wallet Integration Status */}
            {user && (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-slate-400" /> Wallet Balance:
                </span>
                <span className={`font-bold ${user.walletBalance < grandTotal ? 'text-red-500' : 'text-slate-800'}`}>
                  ₹{user.walletBalance}
                </span>
              </div>
            )}

            {/* Razorpay Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!user || loadingCheckout}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                (user && !loadingCheckout)
                  ? 'bg-farm-600 hover:bg-farm-700' 
                  : 'bg-slate-300 border border-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> 
              <span>{loadingCheckout ? 'Connecting Gateway...' : 'Pay & Place Order (Razorpay)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Cart;
