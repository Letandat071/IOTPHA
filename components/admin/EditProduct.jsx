import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditProduct = ({ setIsEditProductModal, selectedProduct, handleUpdateProduct }) => {
  const [product, setProduct] = useState(selectedProduct);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
    setVisible(true); // Hiển thị form với hiệu ứng
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", product);
    handleUpdateProduct(product);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setIsEditProductModal(false), 300); // Đợi hiệu ứng kết thúc trước khi đóng modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative ${visible ? 'modal-visible' : 'modal-hidden'}`}>
        <span className="absolute top-2 right-2 text-gray-600 cursor-pointer text-2xl" onClick={handleClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-4 text-center">Chỉnh sửa sản phẩm</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Tên sản phẩm:</span>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Danh mục:</span>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Giá:</span>
            <input
              type="number"
              name="prices"
              value={product.prices[0]}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  prices: [parseFloat(e.target.value)],
                }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
