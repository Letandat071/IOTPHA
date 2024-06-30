import Order from "../../../models/Order";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      try {
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
      break;

    case "DELETE":
      try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: deletedOrder });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
          return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: updatedOrder });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
};

export default handler;
