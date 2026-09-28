import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Truck, Calendar, MapPin, 
  CheckCircle2, Compass, Apple, Tractor, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Orders = () => {
  const { user, role, orders, updateOrderStatus } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-700">Please sign in to track orders</h3>
        <Link to="/login" className="px-5 py-2.5 bg-farm-600 text-white rounded-xl text-xs font-bold inline-block shadow">
          Sign In
        </Link>
      </div>
    );
  }

  // Filter relevant orders
  const relevantOrders = role === 'farmer'
    ? orders.filter(ord => ord.items.some(item => item.farmerName === user.name))
    : orders.filter(ord => ord.customerId === user.id);

  // Stepper helper
  const steps = [
    { label: 'Placed', desc: 'Order received & routed' },
    { label: 'Harvesting', desc: 'Fresh plucking at farm' },
    { label: 'Ready to Dispatch', desc: 'Washed, sorted & packed' },
    { label: 'Out for Delivery', desc: 'En route to doorstep' },
    { label: 'Delivered', desc: 'Fulfillment completed' }
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(st => st.label.toLowerCase() === status.toLowerCase());
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div>
        <h2 className="text-2xl font-display font-black text-slate-800">Track Direct Harvests</h2>
        <p className="text-xs text-slate-400 font-medium">Real-time status of your direct-trade transactions</p>
      </div>

      {relevantOrders.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block">
            <Compass className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Orders Under Tracker</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You don't have any active orders right now. Shop fresh fruits, honey, or milk to start a tracker.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 bg-farm-600 text-white rounded-xl text-xs font-bold shadow inline-block"
          >
            Visit Shop Store
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {relevantOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);

            return (
              <div 
                key={order.id}
                className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8 space-y-8"
              >
                {/* 1. Header info details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">TRACKING ID</span>
                    <span className="text-sm font-extrabold text-slate-750">{order.id}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{order.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Visual Stepper Graph */}
                <div className="py-4 overflow-x-auto">
                  <div className="min-w-[650px] flex items-start justify-between relative">
                    {/* Background Bar */}
                    <div className="absolute left-[35px] right-[35px] top-[14px] h-1 bg-slate-100 -z-0" />
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute left-[35px] top-[14px] h-1 bg-farm-650 -z-0 transition-all duration-500" 
                      style={{ 
                        width: `${(currentStepIdx / (steps.length - 1)) * 90}%` 
                      }}
                    />

                    {steps.map((st, sIdx) => {
                      const isCompleted = sIdx < currentStepIdx;
                      const isActive = sIdx === currentStepIdx;
                      const isUpcoming = sIdx > currentStepIdx;

                      return (
                        <div key={sIdx} className="flex flex-col items-center text-center relative z-10 w-28">
                          {/* Dot Circle */}
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                            isCompleted 
                              ? 'bg-farm-600 border-farm-600 text-white' 
                              : isActive
                              ? 'bg-white border-farm-600 text-farm-600 ring-4 ring-farm-100 animate-pulse-soft'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                          </div>
                          
                          {/* Stepper Label */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-3 block ${
                            isActive ? 'text-farm-700 font-extrabold' : 'text-slate-500'
                          }`}>
                            {st.label}
                          </span>
                          
                          {/* Description text */}
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5 px-1 leading-relaxed">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Items & address breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                  
                  {/* Items list */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itemized Breakdown</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-650">
                          <div className="flex items-center gap-2">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                            <div>
                              <span>{item.name}</span>
                              <span className="block text-[9px] text-slate-400">Farm: {item.farmerName}</span>
                            </div>
                          </div>
                          <span>{item.quantity} x ₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary bill details */}
                  <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-550">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Items Total</span>
                        <span className="text-slate-800">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery & Packaging Fees</span>
                        <span className="text-slate-800">₹{order.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Farmer Tip</span>
                        <span className="text-slate-800">₹{order.farmerContribution}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-slate-900 font-bold">
                        <span>Total Paid</span>
                        <span className="text-sm font-extrabold text-farm-600">₹{order.grandTotal}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-slate-450 block uppercase tracking-tight font-bold">Delivery Destination</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold mt-1">
                        {order.address}
                      </p>
                    </div>

                    {/* Developer tracking helper buttons if Farmer role */}
                    {role === 'farmer' && order.status !== 'Delivered' && (
                      <div className="border-t border-slate-200 pt-4 space-y-2">
                        <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider block">
                          Farmer Fulfillment Controls (Developer view)
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const states = ['Placed', 'Harvesting', 'Ready to Dispatch', 'Out for Delivery', 'Delivered'];
                              const currentIdx = states.indexOf(order.status);
                              if (currentIdx < states.length - 1) {
                                updateOrderStatus(order.id, states[currentIdx + 1]);
                              }
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider cursor-pointer"
                          >
                            Advance Status Stage &gt;
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default Orders;
