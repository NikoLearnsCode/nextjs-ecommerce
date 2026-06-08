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

export const paymentSchema = z
  .object({
    paymentMethod: z.enum(['card', 'swish', 'klarna']),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    swishNumber: z.string().optional(),
    klarnaNumber: z.string().optional(),
    campaignCode: z.string().optional(),
  })
  //  Validate only the selected method's fields
  .superRefine((data, ctx) => {
    const fail = (path: string, message: string) =>
      ctx.addIssue({code: z.ZodIssueCode.custom, path: [path], message});

    if (data.paymentMethod === 'card') {
      if ((data.cardNumber?.length ?? 0) < 16)
        fail('cardNumber', 'Card number must be at least 16 digits');
      if ((data.expiryDate?.length ?? 0) < 5)
        fail('expiryDate', 'Expiry must be in MM/YY format');
      if ((data.cvv?.length ?? 0) < 3) fail('cvv', 'CVV must be 3 digits');
    } else if (data.paymentMethod === 'swish') {
      if ((data.swishNumber?.length ?? 0) < 10)
        fail('swishNumber', 'Swish number must be at least 10 digits');
    }
  });

export type PaymentFormData = z.infer<typeof paymentSchema>;
