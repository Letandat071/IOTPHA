import { useState, useEffect } from "react";
import axios from "axios";

const EditProduct = ({ setIsEditProductModal, selectedProduct, handleUpdateProduct }) => {
  const [product, setProduct] = useState(selectedProduct);
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";
    if (!value) {
      switch (name) {
        case "title":
          errorMessage = "Tên sản phẩm không được bỏ trống";
          break;
        case "category":
          errorMessage = "Danh mục không được bỏ trống";
          break;
        case "prices":
          errorMessage = "Giá không được bỏ trống";
          break;
        default:
          errorMessage = "Trường này không được bỏ trống";
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.title) newErrors.title = "Tên sản phẩm không được bỏ trống";
    if (!product.category) newErrors.category = "Danh mục không được bỏ trống";
    if (!product.prices[0]) newErrors.prices = "Giá không được bỏ trống";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      handleUpdateProduct(product);
    }
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
              onBlur={handleBlur}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.title && <p className="text-red-500 text-sm pt-2">{errors.title}</p>}
          </label>
          <label className="block">
            <span className="text-gray-700">Danh mục:</span>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm pt-2">{errors.category}</p>}
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
              onBlur={handleBlur}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.prices && <p className="text-red-500 text-sm pt-2">{errors.prices}</p>}
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
