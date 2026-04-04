export const STEP_INFO = {
  delivery: 'Shipping',
  payment: 'Payment',
  confirmation: 'Confirmation',
} as const;

export type CheckoutStep = keyof typeof STEP_INFO;
export const CHECKOUT_STEPS = Object.keys(STEP_INFO) as CheckoutStep[];

/**
 * Whether the user can access a checkout step given completed steps.
 */
export const canAccessStep = (
  step: CheckoutStep,
  completedSteps: CheckoutStep[]
): boolean => {
  if (step === 'delivery') return true;
  if (step === 'payment') return completedSteps.includes('delivery');
  if (step === 'confirmation') return completedSteps.includes('payment');
  return false;
};

/**
 * Build checkout URL with step and optional guest flag.
 */
export const getCheckoutUrl = (
  step: CheckoutStep,
  isGuest?: boolean
): string => {
  return `/checkout?step=${step}${isGuest ? '&guest=true' : ''}`;
};

/**
 * Validate step from URL; if not allowed, return the latest permitted step.
 */
export const validateStep = (
  urlStep: string | null,
  completedSteps: CheckoutStep[],
  hasCompletedOrder: boolean = false
): CheckoutStep => {
  const step = urlStep as CheckoutStep;

  // Invalid step → start at delivery
  if (!CHECKOUT_STEPS.includes(step)) {
    return 'delivery';
  }

  // Confirmation allowed after a completed order
  if (step === 'confirmation' && hasCompletedOrder) {
    return 'confirmation';
  }

  // Step not reachable → fall back to latest allowed
  if (!canAccessStep(step, completedSteps)) {
    if (completedSteps.includes('delivery')) return 'payment';
    return 'delivery';
  }

  return step;
};
