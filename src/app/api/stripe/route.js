

import { NextResponse } from 'next/server';
import Stripe from 'stripe'

const PRICE_ID = '{{ REPLACE_WITH_PRICE_ID }}'

export async function POST(req) {
  const type = (await req.json())['type']

  try {
    switch (type) {
      case 'checkout': {
        const secretKey = process.env.STRIPE_SECRET_KEY
        const stripe = new Stripe(secretKey)

        const stripeSession = await stripe.checkout.sessions.create({
          ui_mode: 'embedded',
          line_items: [
            {
              price: PRICE_ID,
              quantity: 1,
            },
          ],
          mode: 'payment',
          return_url: `/checkout?session_id={CHECKOUT_SESSION_ID}`,
        })

        return NextResponse.json({
          clientSecret: stripeSession.client_secret,
        });
      }
    }
    return new NextResponse(null);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, {
        status: 400,
      });
    }

    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }
}
