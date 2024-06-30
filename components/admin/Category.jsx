import { useEffect, useState } from "react";
import Input from "../form/Input";
import Title from "../ui/Title";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../ui/ConfirmModal";
import EditCategoryModal from "./EditCategoryModal"; 
import CategoryVisibilityToggle from "./CategoryVisibilityToggle";

const Category = () => {
  const [inputText, setInputText] = useState("");
  const [categories, setCategories] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        title: inputText,
      });
      setCategories([...categories, res.data]);
      setInputText("");
      toast.success("Thêm Danh Mục Thành Công", {
        position: "bottom-left",
      });
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi thêm danh mục", {
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToDelete}`);
      setCategories(categories.filter((cat) => cat._id !== categoryToDelete));
      toast.warning("Xoá Danh Mục Thành Công", {
        position: "bottom-left",
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi xoá danh mục", {
        position: "bottom-left",
      });
    } finally {
      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${updatedCategory._id}`, updatedCategory);
      if (res.status === 200) {
        setCategories(categories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat)));
        toast.success("Cập Nhật Danh Mục Thành Công", {
          position: "bottom-left",
        });
        setIsEditCategoryModalOpen(false);
      } else {
        toast.error("Đã có lỗi xảy ra khi cập nhật danh mục", {
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi cập nhật danh mục", {
        position: "bottom-left",
      });
    }
  };

  const updateCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lg:p-8 p-4 flex-1 lg:mt-0 mt-5 bg-white-59 rounded-lg shadow-lg">
      <Title addClass="text-[40px] text-center text-black">Danh Mục</Title>
      <div className="mt-5 flex gap-4 items-center">
        <Input
          placeholder="Thêm Danh Mục !"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold p-4 rounded-full shadow-lg transition duration-300"
          onClick={handleCreate}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="mt-10 max-h-[40rem] overflow-auto p-4 flex flex-col space-y-4 bg-white rounded-lg shadow-lg">
        {categories.map((category) => (
          <div
            className="flex justify-between items-center p-4 bg-gray-50 border-l-4 border-primary rounded-lg hover:border-secondary transition-all shadow-sm"
            key={category._id}
          >
            <b className="sm:text-xl text-md text-gray-800">{category.title}</b>
            <div className="flex items-center space-x-2">
              <CategoryVisibilityToggle category={category} onUpdate={updateCategories} />
              <button
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
                onClick={() => handleDelete(category._id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              <button
                className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-300"
                onClick={() => handleEdit(category)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditCategoryModalOpen && (
        <EditCategoryModal
          setIsEditCategoryModal={setIsEditCategoryModalOpen}
          selectedCategory={categoryToEdit}
          handleUpdateCategory={handleUpdateCategory}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="Bạn có muốn xóa danh mục này không?"
      />
    </div>
  );
};

export default Category;
