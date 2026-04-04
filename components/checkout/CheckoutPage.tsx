'use client';

import {useState, useEffect, useCallback} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCart} from '@/context/CartProvider';
import DeliveryStep from '@/components/checkout/steps/DeliveryStep';
import PaymentStep from '@/components/checkout/steps/PaymentStep';
import OrderConfirmation from './steps/OrderConfirmation';
import Steps from './steps/StepBar';
import CheckoutLayoutDesktop from './desktop/CheckoutLayoutDesktop';
import CheckoutLayoutMobile from './mobile/CheckoutLayoutMobile';
import SpinningLoader from '@/components/shared/ui/SpinningLogo';
import {Toaster} from 'sonner';
import {DeliveryFormData} from '@/lib/validators/checkout-validation';
import {CreateOrderResult, CartItemWithProduct} from '@/lib/types/db-types';
import {CheckoutStep, getCheckoutUrl, validateStep} from './steps/stepsHelper';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {cartItems, loading, totalPrice, clearCart} = useCart();

  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData | null>(
    null,
  );
  const [completedOrder, setCompletedOrder] =
    useState<CreateOrderResult | null>(null);
  const [orderSnapshot, setOrderSnapshot] = useState<{
    items: CartItemWithProduct[];
    totalPrice: number;
  } | null>(null);

  const stepParam = searchParams.get('step');
  const isGuest = searchParams.get('guest') === 'true';

  const currentStep = validateStep(stepParam, completedSteps, !!completedOrder);

  const completeDeliveryStep = useCallback(
    (data: DeliveryFormData) => {
      setDeliveryData(data);
      setCompletedSteps((prev) => [...prev, 'delivery']);
      router.push(getCheckoutUrl('payment', isGuest));
    },
    [router, isGuest],
  );

  const completePaymentStep = useCallback(
    (orderData: CreateOrderResult) => {
      // Snapshot order before cart is cleared
      setOrderSnapshot({
        items: cartItems,
        totalPrice: totalPrice,
      });
      setCompletedOrder(orderData);
      setCompletedSteps((prev) => [...prev, 'payment']);
      router.push(getCheckoutUrl('confirmation', isGuest));
    },
    [router, isGuest, cartItems, totalPrice],
  );

  // Redirect if cart is empty (except on confirmation)
  useEffect(() => {
    if (!loading && cartItems.length === 0 && currentStep !== 'confirmation') {
      router.push('/cart');
      return;
    }
  }, [loading, cartItems.length, router, currentStep]);

  // Redirect to delivery when no step in URL
  useEffect(() => {
    if (!loading && cartItems.length > 0 && !stepParam) {
      router.push(getCheckoutUrl('delivery', isGuest));
    }
  }, [stepParam, router, isGuest, loading, cartItems.length]);

  if (loading) {
    return (
      <div className='fixed inset-0 flex flex-col  mb-40 justify-center items-center'>
        <SpinningLoader height='40' className='opacity-30 pb-4' />
      </div>
    );
  }

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return null;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'delivery':
        return (
          <DeliveryStep
            onNext={completeDeliveryStep}
            initialData={deliveryData}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            onNext={completePaymentStep}
            deliveryData={deliveryData}
          />
        );
      case 'confirmation':
        return (
          <OrderConfirmation
            order={completedOrder}
            orderSnapshot={orderSnapshot}
            clearCart={clearCart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <Steps currentStep={currentStep} />

      <div className='hidden md:block'>
        <CheckoutLayoutDesktop currentStep={currentStep}>
          {renderStepContent()}
        </CheckoutLayoutDesktop>
      </div>

      <div className='block md:hidden'>
        <CheckoutLayoutMobile currentStep={currentStep}>
          {renderStepContent()}
        </CheckoutLayoutMobile>
      </div>

      <Toaster />
    </div>
  );
}
