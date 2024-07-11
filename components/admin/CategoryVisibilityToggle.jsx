import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const CategoryVisibilityToggle = ({ category, onUpdate }) => {
  const [visible, setVisible] = useState(category.visible);

  const toggleVisibility = async () => {
    try {
      const newVisibility = !visible;
      const res = await axios.put(`/api/categories/${category._id}`, { visible: newVisibility });
      setVisible(res.data.data.visible);
      onUpdate();

      if (newVisibility) {
        toast.success("Hiện danh mục thành công", {
          position: "bottom-left",
        });
      } else {
        toast.success("Ẩn danh mục thành công", {
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.error("Failed to update visibility", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật trạng thái hiển thị", {
        position: "bottom-left",
      });
    }
  };

  return (
    <button
      onClick={toggleVisibility}
      className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
    >
      <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
    </button>
  );
};

export default CategoryVisibilityToggle;
