'use client';

import {useState} from 'react';
import {Button} from '@/components/shared/ui/button';
import {Product} from '@/lib/types/db-types';
import {AddToCartItem} from '@/lib/types/db-types';
import {useCart} from '@/context/CartProvider';
import {
  CART_HEADER_POPOVER_ID,
  showHeaderPopover,
} from '@/components/shared/HeaderPopoverPanel';

type AddToCartButtonProps = {
  product: Product;
  quantity: number;
  className?: string;
  onAddSuccess?: () => void;
  onSizeMissing?: () => void;
  selectedSize: string;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  selectedSize,
  onAddSuccess,
  onSizeMissing,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {addItem} = useCart();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      onSizeMissing?.();
      return;
    }

    setIsLoading(true);
    try {
      const itemToAdd: AddToCartItem = {
        product_id: product.id,
        quantity: quantity,
        size: selectedSize,
      };

      await addItem(itemToAdd);

      onAddSuccess?.();
      showHeaderPopover(CART_HEADER_POPOVER_ID);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Adding...' : 'Add to cart'}
    </Button>
  );
}
