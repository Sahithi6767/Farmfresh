import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsData } from '../data/productsData';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_ORDERS = [
  {
    id: 'ORD-98274',
    date: 'June 26, 2026',
    customerName: 'Rohan Sharma',
    customerId: 'cust-1',
    items: [
      {
        id: 'reddy-turmeric-powder',
        name: 'Pure Turmeric Powder (Haldi)',
        price: 195,
        quantity: 2,
        unit: '500g Resealable Pack',
        farmerName: 'Thirupathi Reddy',
        image: 'https://images.unsplash.com/photo-1615485500704-8e3b96ef9726?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'reddy-sona-masuri-rice',
        name: 'Sona Masuri Raw Rice (HMT)',
        price: 90,
        quantity: 2,
        unit: '1 kg',
        farmerName: 'Thirupathi Reddy',
        image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9b8b0?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 570,
    deliveryFee: 0,
    farmerContribution: 20,
    grandTotal: 590,
    status: 'Ready to Dispatch',
    address: 'Apartment 4B, Green Glen Layout, Bellandur, Bengaluru - 560103',
    paymentMethod: 'FarmFresh Wallet'
  }
];

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ff_token') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('ff_role') || 'customer');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'register'

  const [globalProducts, setGlobalProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingSession, setLoadingSession] = useState(true);

  // Authenticated fetch helper
  const authFetch = async (url, options = {}) => {
    const activeToken = token || localStorage.getItem('ff_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return fetch(url, { ...options, headers });
  };

  // Hydrate active session on initial app load via GET /api/auth/me
  useEffect(() => {
    const hydrateSession = async () => {
      const savedToken = localStorage.getItem('ff_token');
      const savedUser = localStorage.getItem('ff_user');

      if (savedToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
            setRole(data.user.role || 'customer');
            setToken(savedToken);
            localStorage.setItem('ff_user', JSON.stringify(data.user));
            localStorage.setItem('ff_role', data.user.role || 'customer');
          } else {
            // Token invalid or expired
            console.warn('Session token expired or invalid');
            logout();
          }
        } catch (err) {
          console.error('Failed to hydrate session from backend:', err);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } else if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoadingSession(false);
    };

    hydrateSession();

    // Initialize mock lists
    const savedProducts = localStorage.getItem('ff_products');
    const savedOrders = localStorage.getItem('ff_orders');
    const savedWishlist = localStorage.getItem('ff_wishlist');
    const savedAddresses = localStorage.getItem('ff_addresses');

    if (savedProducts) {
      setGlobalProducts(JSON.parse(savedProducts));
    } else {
      setGlobalProducts(productsData);
      localStorage.setItem('ff_products', JSON.stringify(productsData));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(DEFAULT_ORDERS);
      localStorage.setItem('ff_orders', JSON.stringify(DEFAULT_ORDERS));
    }

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    } else {
      setWishlist([]);
    }

    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const defaultAddresses = [
        { id: 'addr-1', label: 'Home', address: 'Apartment 4B, Green Glen Layout, Bellandur, Bengaluru - 560103' },
        { id: 'addr-2', label: 'Office', address: 'Block C, Ground Floor, Manyata Tech Park, Nagawara, Bengaluru - 560045' }
      ];
      setAddresses(defaultAddresses);
      localStorage.setItem('ff_addresses', JSON.stringify(defaultAddresses));
    }
  }, []);

  const login = async (email, password, selectedRole = null) => {
    try {
      const payload = { email, password };
      if (selectedRole) payload.role = selectedRole;

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        const userRole = data.user.role || selectedRole || 'customer';
        setRole(userRole);

        localStorage.setItem('ff_token', data.token);
        localStorage.setItem('ff_user', JSON.stringify(data.user));
        localStorage.setItem('ff_role', userRole);

        setAuthModalOpen(false);
        return { success: true, message: data.message || 'Logged in successfully!' };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, message: 'Network error connecting to authentication server.' };
    }
  };

  const signup = async (name, email, password, selectedRole, farmDetails = {}) => {
    try {
      const payload = {
        full_name: name,
        name: name,
        email: email,
        password: password,
        role: selectedRole,
        phone: farmDetails.phone || '',
        address: farmDetails.address || '',
        farm_name: farmDetails.farm_name || farmDetails.farmName || '',
        farm_location: farmDetails.farm_location || farmDetails.location || '',
        location: farmDetails.location || farmDetails.farm_location || '',
        farm_story: farmDetails.farm_story || farmDetails.story || ''
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        const userRole = data.user.role || selectedRole;
        setRole(userRole);

        localStorage.setItem('ff_token', data.token);
        localStorage.setItem('ff_user', JSON.stringify(data.user));
        localStorage.setItem('ff_role', userRole);

        setAuthModalOpen(false);
        return { success: true, message: data.message || 'Registered successfully!' };
      } else {
        const errorMsg = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Registration failed');
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      return { success: false, message: 'Network error connecting to authentication server.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole('customer');
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    localStorage.setItem('ff_role', 'customer');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('ff_role', newRole);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const addFarmerProduct = (newProductData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      organic: true,
      rating: 4.8,
      reviewsCount: 1,
      tags: ['Fresh harvest', 'Direct Trade'],
      harvestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      shelfLifeDays: 5,
      nutrients: { calories: 'Approx 40 kcal/100g' },
      farmer: {
        name: user ? user.name : 'Partner Farmer',
        farmName: user ? (user.farm_name || user.farmName) : 'Organic Farm',
        location: user ? (user.farm_location || user.location) : 'India',
        distanceKm: user ? user.distance_km || 25 : 25,
        rating: 5.0,
        avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
        story: user ? user.farm_story : 'Dedicated organic farmer.'
      },
      ...newProductData
    };

    const updatedProducts = [newProduct, ...globalProducts];
    setGlobalProducts(updatedProducts);
    localStorage.setItem('ff_products', JSON.stringify(updatedProducts));
  };

  const placeOrder = (items, totalAmount, deliveryFee, farmerContribution) => {
    const grandTotal = totalAmount + deliveryFee + farmerContribution;
    
    if (role === 'customer' && user && user.wallet_balance >= grandTotal) {
      const updatedUser = {
        ...user,
        wallet_balance: user.wallet_balance - grandTotal
      };
      setUser(updatedUser);
      localStorage.setItem('ff_user', JSON.stringify(updatedUser));
    }

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: user ? user.name : 'Customer',
      customerId: user ? user.id : 'guest',
      items: items,
      totalAmount,
      deliveryFee,
      farmerContribution,
      grandTotal,
      status: 'Placed',
      address: user ? user.address : 'Delivery Address',
      paymentMethod: 'FarmFresh Wallet'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('ff_orders', JSON.stringify(updatedOrders));

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updatedOrders);
    localStorage.setItem('ff_orders', JSON.stringify(updatedOrders));
  };

  const toggleWishlist = (productId) => {
    const updated = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem('ff_wishlist', JSON.stringify(updated));
  };

  const addAddress = (label, fullAddress) => {
    const newAddress = {
      id: `addr-${Date.now()}`,
      label,
      address: fullAddress
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem('ff_addresses', JSON.stringify(updated));
  };

  const removeAddress = (addressId) => {
    const updated = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updated);
    localStorage.setItem('ff_addresses', JSON.stringify(updated));
  };

  const deleteProduct = (productId) => {
    const updated = globalProducts.filter(p => p.id !== productId);
    setGlobalProducts(updated);
    localStorage.setItem('ff_products', JSON.stringify(updated));
  };

  const updateProduct = (productId, updatedData) => {
    const updated = globalProducts.map(p => {
      if (p.id === productId) {
        return { ...p, ...updatedData };
      }
      return p;
    });
    setGlobalProducts(updated);
    localStorage.setItem('ff_products', JSON.stringify(updated));
  };

  const addProduct = (newProductData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      organic: true,
      rating: 4.8,
      reviewsCount: 1,
      tags: ['New Product', 'Direct Trade'],
      harvestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      shelfLifeDays: 15,
      nutrients: { calories: 'Approx 50 kcal/100g' },
      farmer: {
        name: newProductData.farmerName || 'Partner Farmer',
        farmName: newProductData.farmName || 'Organic Farm',
        location: newProductData.location || 'India',
        distanceKm: 38,
        rating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
        story: 'Certified farming partner delivering clean organic products.'
      },
      ...newProductData
    };
    const updated = [newProduct, ...globalProducts];
    setGlobalProducts(updated);
    localStorage.setItem('ff_products', JSON.stringify(updated));
  };

  const addExternalOrder = (order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('ff_orders', JSON.stringify(updatedOrders));
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      role,
      authModalOpen,
      authModalTab,
      loadingSession,
      authFetch,
      login,
      signup,
      logout,
      switchRole,
      openAuthModal,
      closeAuthModal,
      setAuthModalTab,
      globalProducts,
      orders,
      wishlist,
      addresses,
      addFarmerProduct,
      placeOrder,
      updateOrderStatus,
      toggleWishlist,
      addAddress,
      removeAddress,
      deleteProduct,
      updateProduct,
      addProduct,
      addExternalOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
