import React from 'react';
import { formatPrice } from '../../lib/foodFeed';
import { CreditCard, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartSummary({ subtotal, deliveryFee, totalAmount }) {
  const handleCheckout = () => {
    toast('Checkout functionality coming in Phase 2!', {
      icon: '🚧',
    });
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-6 backdrop-blur-xl">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <p>Subtotal</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(subtotal)}</p>
        </div>
        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <p>Delivery Fee</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(deliveryFee)}</p>
        </div>
        <div className="my-2 border-t border-zinc-200 dark:border-zinc-800/80 border-dashed" />
        <div className="flex items-center justify-between">
          <p className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">Total</p>
          <p className="font-heading text-lg font-black text-orange-600 dark:text-orange-500">
            {formatPrice(totalAmount)}
          </p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-[0.98]"
      >
        <CreditCard className="h-4 w-4" />
        Proceed to Checkout
      </button>
      <p className="mt-3 text-center text-[10px] font-medium text-zinc-500 dark:text-zinc-500">
        Secure checkout powered by Razorpay (Coming in Phase 2)
      </p>
    </div>
  );
}
