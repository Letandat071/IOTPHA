import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { items, orderIds } = req.body;

    if (!items || !Array.isArray(items) || !orderIds || !Array.isArray(orderIds)) {
      res.status(400).json({ error: 'Invalid items or orderIds data' });
      return;
    }

    try {
      const lineItems = items.map((item, index) => ({
        price_data: {
          currency: 'VND',
          product_data: {
            name: ` ${item.name}`,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/payments?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/payments/cancel`,
        metadata: {
          orderIds: orderIds.join(','),
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
