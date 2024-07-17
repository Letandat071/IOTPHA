import dbConnect from '../../../util/dbConnect';
import Coupon from '../../../models/Coupon';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    const coupons = await Coupon.find({ usedBy: id });

    return res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
  }
}
