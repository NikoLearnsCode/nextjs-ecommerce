import {z} from 'zod';

export const deliverySchema = z.object({
  deliveryMethod: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  postalCode: z.string().min(5, 'Postal code must be 5 digits'),
  city: z.string().min(2, 'City must be at least 2 characters'),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

export const paymentSchema = z.object({
  paymentMethod: z.string(),
  cardNumber: z
    .string()
    .min(16, 'Card number must be at least 16 digits')
    .optional(),
  expiryDate: z
    .string()
    .min(5, 'Expiry must be in MM/YY format')
    .optional(),
  cvv: z.string().min(3, 'CVV must be 3 digits').optional(),
  swishNumber: z
    .string()
    .min(10, 'Swish number must be at least 10 digits')
    .optional(),
  klarnaNumber: z
    .string()
    .min(10, 'Klarna number must be at least 10 digits')
    .optional(),
  campaignCode: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
