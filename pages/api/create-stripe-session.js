// pages/api/create-stripe-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { items, orderId } = req.body;
  
      if (!items || !Array.isArray(items) || !orderId) {
        res.status(400).json({ error: 'Invalid items or orderId data' });
        return;
      }
  
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: items.map(item => ({
            price_data: {
              currency: 'VND',
              product_data: {
                name: item.name,
              },
              unit_amount: item.amount,
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${req.headers.origin}/order/${orderId}?payment=success`,
          cancel_url: `${req.headers.origin}/order/${orderId}?payment=cancel`,
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
