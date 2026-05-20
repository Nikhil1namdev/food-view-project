import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { cn } from '../../lib/utils';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    deliveryFee, 
    totalAmount,
    FREE_DELIVERY_THRESHOLD,
    progressPercentage
  } = useCart();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[100] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-[#050507]",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">Your Cart</h2>
          </div>
          <button 
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors"
            aria-label="Close Cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
                <ShoppingBag className="h-10 w-10 text-orange-400 opacity-80" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">Your cart is empty</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px]">
                Looks like you haven't added any delicious food yet.
              </p>
              <button 
                onClick={closeCart}
                className="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:text-orange-500 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-orange-400"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Free Delivery Progress */}
              <div className="bg-orange-50/50 dark:bg-orange-500/5 p-4 border-b border-zinc-200 dark:border-zinc-800/80">
                {progressPercentage >= 100 ? (
                  <div className="text-sm font-bold text-green-600 dark:text-green-500 flex items-center gap-1.5">
                    <span>🎉 You unlocked free delivery!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Add <span className="font-bold text-orange-500">₹{FREE_DELIVERY_THRESHOLD - subtotal}</span> more for free delivery
                    </p>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {cartItems.map((item) => (
                <CartItem 
                  key={item.foodId} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <CartSummary 
            subtotal={subtotal} 
            deliveryFee={deliveryFee} 
            totalAmount={totalAmount} 
          />
        )}
      </div>
    </>
  );
}
