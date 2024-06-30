import Category from "../../../models/Category";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  if (method === "POST") {
    try {
      const newCategory = await Category.create(req.body);
      res.status(200).json(newCategory);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

export default handler;
