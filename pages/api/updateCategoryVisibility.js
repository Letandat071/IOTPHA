// pages/api/updateCategoryVisibility.js
import dbConnect from "../../util/dbConnect";
import Product from "../../models/Product";
import Category from "../../models/Category";

const handler = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Fetch all categories
    const categories = await Category.find();

    // Iterate through each category to check product quantities
    for (const category of categories) {
      const productsInCategory = await Product.find({ category: category.title });

      // Check if all products in the category have a quantity of 0
      const allQuantitiesZero = productsInCategory.every(product => product.soLuong === 0);

      // Update category visibility based on product quantities
      if (allQuantitiesZero && category.visible) {
        await Category.findByIdAndUpdate(category._id, { visible: false });
      } else if (!allQuantitiesZero && !category.visible) {
        await Category.findByIdAndUpdate(category._id, { visible: true });
      }
    }

    return res.status(200).json({ success: true, message: "Danh mục cập nhật thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default handler;
