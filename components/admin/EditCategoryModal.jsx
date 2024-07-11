import { useState, useEffect } from "react";

const EditCategoryModal = ({ setIsEditCategoryModal, selectedCategory, handleUpdateCategory }) => {
  const [category, setCategory] = useState(selectedCategory);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Hiển thị form với hiệu ứng
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateCategory(category);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setIsEditCategoryModal(false), 300); // Chờ hiệu ứng hoàn tất trước khi đóng modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative transform transition-transform duration-300 ${visible ? 'scale-100' : 'scale-90 opacity-0'}`}>
        <span className="absolute top-2 right-2 text-gray-600 cursor-pointer text-2xl" onClick={handleClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-4 text-center">Chỉnh sửa danh mục</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Tên danh mục:</span>
            <input
              type="text"
              name="title"
              value={category.title}
              onChange={handleChange}
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

export default EditCategoryModal;
