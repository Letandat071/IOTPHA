// pages/api/categories/[id].js
import Category from "../../../models/Category";
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
        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
      break;

    case "DELETE":
      try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
          return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: deletedCategory });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { visible } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { visible }, { new: true });
        if (!updatedCategory) {
          return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: updatedCategory });
      } catch (error) {
        res.status500().json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
};

export default handler;
