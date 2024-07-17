import dbConnect from '../../../util/dbConnect';
import Coupon from '../../../models/Coupon';
import Product from '../../../models/Product';
import Category from '../../../models/Category';

export default async function handler(req, res) {
  const { code, userId, productIds, totalAmount } = req.body;

  await dbConnect();

  try {
    const coupon = await Coupon.findOne({ code, couponStatus: 'active' });

    if (!coupon) {
      return res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' });
    }

    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.expirationDate) {
      return res.status(400).json({ message: 'Mã giảm giá không còn hiệu lực.' });
    }

    const applicableCategory = await Category.findById(coupon.applicableCategory);

    // Lấy danh mục của các sản phẩm
    const products = await Product.find({ _id: { $in: productIds } });
    const productCategories = products.map(product => product.category);

    console.log("Danh mục sản phẩm:", productCategories);
    console.log("Danh mục áp dụng mã giảm giá:", applicableCategory.title);

    if (!productCategories.includes(applicableCategory.title)) {
      return res.status(400).json({ message: 'Mã giảm giá không áp dụng cho danh mục này.' });
    }

    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({ message: 'Mã giảm giá đã được sử dụng.' });
    }

    const discountAmount = Math.min((totalAmount * coupon.percentageValue) / 100, coupon.maxDiscountValue);

    coupon.usedBy.push(userId);
    await coupon.save();

    return res.status(200).json({ discountAmount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
  }
}
