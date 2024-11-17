'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

import { cn } from '@/lib/utils'

export const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const appearance = {
  theme: 'stripe',
  variables: {
    borderRadius: '6px',
    colorPrimary: '#030712',
    focusBoxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 2px, rgb(161, 161, 170) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  },
  rules: {
    '.Label': {
      fontWeight: '500',
      fontSize: '0.875rem',
    },
    '.Input': {
      padding: '.685rem 0.75rem',
      borderRadius: '6px',
      fontSize: '.875rem',
      boxShadow: 'none',
      borderColor: '#e4e4e7',
      transition: 'none',
      marginBottom: '0.75rem',
    },
    '.Input:focus': {
      borderColor: '#e4e4e7',
    },
    '.Block': {
      borderRadius: '6px',
    },
  },
}

function Stripe({
  children,
  options,
  className
}) {
  return (
    (<div className={cn('[&>.StripeElement]:py-1', className)}>
      <Elements
        options={{
          appearance,
          ...options,
        }}
        stripe={stripe}>
        {children}
      </Elements>
    </div>)
  );
}

export { Stripe }
