import dbConnect from '../../../util/dbConnect';
import Coupon from '../../../models/Coupon';
import Category from '../../../models/Category';

dbConnect();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const coupons = await Coupon.find().populate('applicableCategory', 'title');
            res.status(200).json({ success: true, data: coupons });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
