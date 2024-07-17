import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  percentageValue: {
    type: Number,
    required: true,
  },
  maxDiscountValue: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  applicableCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  couponStatus: { type: String, enum: ['deactive', 'active', 'outdate'], default: 'deactive' },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });



export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
