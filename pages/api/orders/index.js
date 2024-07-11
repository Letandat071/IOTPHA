import Order from "../../../models/Order";
import Product from "../../../models/Product";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  if (method === "POST") {
    try {
      const { products } = req.body;
      const productIds = products.map(product => product._id);
      
      // Fetch product quantities from database
      const dbProducts = await Product.find({ _id: { $in: productIds } });

      // Check if any product exceeds the available quantity
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const dbProduct = dbProducts.find(p => p._id.toString() === product._id);
        
        if (dbProduct.soLuong < product.foodQuantity) {
          return res.status(400).json({ message: `Số lượng ${product.title} vượt quá số lượng có sẵn` });
        }
      }

      // Deduct the quantities from the database
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        await Product.updateOne(
          { _id: product._id },
          { $inc: { soLuong: -product.foodQuantity } }
        );
      }

      // Create new order
      const newOrder = await Order.create(req.body);
      res.status(201).json(newOrder);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create order" });
    }
  }
};

export default handler;
