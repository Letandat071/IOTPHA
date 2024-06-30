import Product from "../../../models/Product";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const {
    method,
    query: { id },
  } = req;

  try {
    switch (method) {
      case "GET":
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.status(200).json(product);
        break;

      case "DELETE":
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.status(200).json(deletedProduct);
        break;

      case "PUT":
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedProduct) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.status(200).json(updatedProduct);
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).json({ message: `Phương thức ${method} không được hỗ trợ` });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export default handler;
