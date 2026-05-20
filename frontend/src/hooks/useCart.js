import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart } = context;

  // Derived state calculations
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Free delivery logic
  const FREE_DELIVERY_THRESHOLD = 499;
  const progressPercentage = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const deliveryFee = totalItems > 0 ? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 49) : 0; 
  const totalAmount = subtotal + deliveryFee;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    totalItems,
    subtotal,
    deliveryFee,
    totalAmount,
    FREE_DELIVERY_THRESHOLD,
    progressPercentage,
  };
};
