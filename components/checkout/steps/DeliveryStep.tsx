'use client';

import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/shared/ui/button';
import {FloatingLabelInput} from '@/components/shared/ui/floatingLabelInput';
import {
  DeliveryFormData,
  deliverySchema,
} from '@/lib/validators/checkout-validation';
import {RadioOption} from '@/components/shared/ui/RadioOption';

interface DeliveryStepProps {
  onNext: (data: DeliveryFormData) => void;
  initialData?: DeliveryFormData | null;
}

const deliveryOptions = [
  {
    value: 'home',
    title: 'Home delivery',
    price: 'FREE',
  },
  {
    value: 'pickup',
    title: 'Pickup location',
    price: 'FREE',
  },
];

export default function DeliveryStep({onNext, initialData}: DeliveryStepProps) {
  const form = useForm<DeliveryFormData>({
    shouldUnregister: false,
    resolver: zodResolver(deliverySchema),
    defaultValues: initialData || {
      deliveryMethod: '',
      firstName: 'Brick',
      lastName: 'Tamland',
      email: 'ilovelamp@channel4.com',
      phone: '123 456 7890',
      address: '123 Main St',
      postalCode: '101 101',
      city: 'San Diego',
    },
  });

  const selectedMethod = useWatch({
    control: form.control,
    name: 'deliveryMethod',
  });

  const onSubmit = (data: DeliveryFormData) => {
    onNext(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-4'>
          <h2 className='text-base uppercase font-semibold'>Delivery method</h2>
          <div className='grid grid-cols-2 gap-3'>
            {deliveryOptions.map((option) => (
              <RadioOption
                key={option.value}
                id={`radio-${option.value}`}
                value={option.value}
                label={option.title}
                checked={selectedMethod === option.value}
                {...form.register('deliveryMethod')}
              >
                <div
                  className={`flex text-[13px] md:text-sm flex-col justify-center items-center p-2 w-full border transition-colors duration-200 hover:border-gray-500 ${
                    selectedMethod === option.value
                      ? 'border-gray-500 bg-gray-50'
                      : 'border-gray-300'
                  }`}
                >
                  <p
                    className={`font-medium ${
                      selectedMethod === option.value ? 'font-semibold' : ''
                    }`}
                  >
                    {option.title}
                  </p>
                  <p className='text-gray-600'>{option.price}</p>
                </div>
              </RadioOption>
            ))}
          </div>
          {form.formState.errors.deliveryMethod && (
            <span role='alert' className='text-red-500 text-sm'>
              {form.formState.errors.deliveryMethod.message}
            </span>
          )}
        </div>

        <div className='space-y-6'>
          <h2 className='text-base uppercase font-semibold'>
            Delivery details
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {[
              {
                name: 'firstName',
                label: 'First name',
                autoComplete: 'given-name',
                gridCol: 'sm:col-span-1',
              },
              {
                name: 'lastName',
                label: 'Last name',
                autoComplete: 'family-name',
                gridCol: 'sm:col-span-1',
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                autoComplete: 'email',
                gridCol: 'sm:col-span-1',
              },
              {
                name: 'phone',
                label: 'Phone',
                type: 'tel',
                autoComplete: 'tel',
                gridCol: 'sm:col-span-1',
              },
              {
                name: 'address',
                label: 'Address',
                autoComplete: 'street-address',
                gridCol: 'sm:col-span-2',
              },
              {
                name: 'postalCode',
                label: 'Postal code',
                autoComplete: 'postal-code',
                gridCol: 'sm:col-span-1',
              },
              {
                name: 'city',
                label: 'City',
                autoComplete: 'address-level2',
                gridCol: 'sm:col-span-1',
              },
            ].map((field) => (
              <div key={field.name} className={field.gridCol}>
                <FloatingLabelInput
                  {...form.register(field.name as keyof DeliveryFormData)}
                  id={field.name}
                  type={field.type}
                  label={field.label}
                  hasError={
                    !!form.formState.errors[
                      field.name as keyof DeliveryFormData
                    ]
                  }
                  errorMessage={
                    form.formState.errors[field.name as keyof DeliveryFormData]
                      ?.message
                  }
                  autoComplete={field.autoComplete}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          type='submit'
          disabled={!selectedMethod}
          className='w-full mt-0 h-16 text-xs uppercase font-bold'
        >
          {!selectedMethod ? 'Select a delivery method' : 'Continue to payment'}
        </Button>
      </form>
    </div>
  );
}
