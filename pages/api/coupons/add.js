import dbConnect from '../../../util/dbConnect';
import Coupon from '../../../models/Coupon';

dbConnect();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { code, percentageValue, maxDiscountValue, expirationDate, startDate, applicableCategory } = req.body;

        // Kiểm tra các trường dữ liệu
        if (!code || !percentageValue || !maxDiscountValue || !expirationDate || !startDate || !applicableCategory) {
            return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin' });
        }

        try {
            const newCoupon = new Coupon({
                code,
                percentageValue,
                maxDiscountValue,
                expirationDate,
                startDate,
                applicableCategory
            });

            await newCoupon.save();
            res.status(201).json({ success: true, data: newCoupon });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
