import axios from 'axios';
import dbConnect from '../../../util/dbConnect';
import Coupon from '../../../models/Coupon';

dbConnect();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const coupons = await Coupon.find();
            const currentDate = new Date();

            // Cập nhật trạng thái của các mã giảm giá
            for (const coupon of coupons) {
                if (currentDate < new Date(coupon.startDate)) {
                    coupon.couponStatus = 'deactive';
                } else if (currentDate >= new Date(coupon.startDate) && currentDate <= new Date(coupon.expirationDate)) {
                    coupon.couponStatus = 'active';
                } else {
                    coupon.couponStatus = 'outdate';
                }
                await coupon.save();
            }

            res.status(200).json({ success: true, data: coupons });
        } catch (error) {
            res.status(400).json({ success: false, error });
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const { code, percentageValue, maxDiscountValue, expirationDate, startDate, applicableCategory } = req.body;
    
        try {
            const updatedCoupon = await Coupon.findByIdAndUpdate(
                id,
                { code, percentageValue, maxDiscountValue, expirationDate, startDate, applicableCategory },
                { new: true, runValidators: true, context: 'query' }
            );
    
            if (!updatedCoupon) {
                return res.status(404).json({ success: false, message: 'Coupon not found' });
            }
    
            const currentDate = new Date();
            if (currentDate < new Date(updatedCoupon.startDate)) {
                updatedCoupon.couponStatus = 'deactive';
            } else if (currentDate >= new Date(updatedCoupon.startDate) && currentDate <= new Date(updatedCoupon.expirationDate)) {
                updatedCoupon.couponStatus = 'active';
            } else {
                updatedCoupon.couponStatus = 'outdate';
            }
            await updatedCoupon.save();
    
            res.status(200).json({ success: true, data: updatedCoupon });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    
    
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const deletedCoupon = await Coupon.findByIdAndDelete(id);

            if (!deletedCoupon) {
                return res.status(404).json({ success: false, message: 'Coupon not found' });
            }

            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
