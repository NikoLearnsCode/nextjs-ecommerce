'use client';

import {AnimatePresence} from 'framer-motion';
import {useCart} from '@/context/CartProvider';
import CartCard from './CartCard';
import CartItemCompact from './CartItemCompact';
type CartItemsProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export default function CartItems({
  compact = false,
  onNavigate,
}: CartItemsProps) {
  const {
    cartItems,
    removeItem,
    updateItemQuantity,
    updatingItems,
    removingItems,
  } = useCart();

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateItemQuantity(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div
      className={
        compact
          ? 'max-h-[25vh] sm:max-h-[40vh] overflow-y-auto py-0.5 [scrollbar-gutter:stable]'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-0.5'
      }
    >
      <AnimatePresence>
        {cartItems.map((item, index) => {
          const isUpdating = updatingItems[item.id] || false;
          const isRemoving = removingItems[item.id] || false;

          // Compact view for header dropdown
          if (compact) {
            return (
              <CartItemCompact
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                isRemoving={isRemoving}
                onNavigate={onNavigate}
                imagePriority={index < 2}
              />
            );
          }

          // Full view for cart page
          return (
            <CartCard
              key={item.id}
              item={item}
              isUpdating={isUpdating}
              isRemoving={isRemoving}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              imagePriority={index < 2}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
