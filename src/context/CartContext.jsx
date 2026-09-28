import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, openAuthModal } = useAuth();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ff_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart to LocalStorage when it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('ff_cart', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    if (!user) {
      if (openAuthModal) openAuthModal('login');
      return false;
    }

    const existingIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex].quantity += qty;
      saveCart(updatedItems);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        farmerName: product.farmer?.name || 'Thirupathi Reddy',
        image: product.image,
        quantity: qty
      };
      saveCart([...cartItems, newItem]);
    }
    return true;
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    saveCart(updatedItems);
  };

  const removeFromCart = (productId) => {
    const filteredItems = cartItems.filter((item) => item.id !== productId);
    saveCart(filteredItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
