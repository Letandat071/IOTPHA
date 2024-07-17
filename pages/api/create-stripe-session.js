// pages/api/create-stripe-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { items, orderId, total, discountPrice } = req.body;
  
      if (!items || !Array.isArray(items) || !orderId || !total) {
        res.status(400).json({ error: 'Invalid data' });
        return;
      }
  
      try {
        let line_items = items.map(item => ({
          price_data: {
            currency: 'VND',
            product_data: {
              name: item.name,
            },
            unit_amount: item.amount,
          },
          quantity: item.quantity,
        }));

        // Thêm mục giảm giá nếu có
        if (discountPrice && discountPrice > 0) {
          // Thay vì thêm một mục giảm giá riêng, chúng ta sẽ điều chỉnh giá của mục đầu tiên
          if (line_items.length > 0) {
            const firstItem = line_items[0];
            const discountedAmount = Math.max(firstItem.price_data.unit_amount - discountPrice, 0);
            firstItem.price_data.unit_amount = discountedAmount;
            firstItem.price_data.product_data.name += ` (Đã giảm giá ${discountPrice} VND)`;
          }
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: line_items,
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