import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('foodview_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodview_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.foodId === food._id);
      if (existing) {
        toast.success(`Increased quantity of ${food.name}`);
        return prev.map((item) =>
          item.foodId === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`Added ${food.name} to cart`);
      return [
        ...prev,
        {
          foodId: food._id,
          name: food.name,
          image: food.image || food.video, // Use video thumbnail/url if no image
          price: food.price,
          restaurantName: food.restaurantName || food.foodPartner?.name,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (foodId, name) => {
    setCartItems((prev) => prev.filter((item) => item.foodId !== foodId));
    if (name) {
      toast.success(`Removed ${name} from cart`);
    }
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.foodId === foodId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
