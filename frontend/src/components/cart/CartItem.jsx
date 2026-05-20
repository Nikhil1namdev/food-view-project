import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../lib/foodFeed';

export default function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
          }}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
              {item.name}
            </h4>
            <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {item.restaurantName || "ByteBite Partner"}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.foodId, item.name)}
            className="text-zinc-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-bold text-orange-600 dark:text-orange-400 text-sm">
            {formatPrice(item.price)}
          </p>

          <div className="flex items-center gap-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-2 py-1 shadow-sm">
            <button
              onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 min-w-[12px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
