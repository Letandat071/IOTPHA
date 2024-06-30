import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      maxlength: 100,
    },
    tablename: {
      type: String,
      required: true,
      maxlength: 200,
    },
    total: {
      type: Number,
      required: true,
    },
    id_customer: {
      type: String,
      required: true,
    },
    paymentstatus:{
      type: String,
      enum: ['Chưa thanh toán','Đang chờ xác nhận', 'Đã thanh toán'],
      default: "Chưa thanh toán"
    },
    status: {
      type: Number,
      default: 0,
    },
    method: {
      type: Number,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
