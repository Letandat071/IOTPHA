// components/admin/CategoryVisibilityUpdater.jsx
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryVisibilityUpdater = () => {
  const updateCategoryVisibility = async () => {
    try {
      const res = await axios.post("/api/updateCategoryVisibility");
      if (res.status === 200) {
        // toast.info("Cập nhật thành công", {
        //   position: "top-right",
        // });
      }
    } catch (error) {
      console.error("Cập nhật thất bại", error);
      toast.error("Cập nhật thất bại", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    updateCategoryVisibility();
    const interval = setInterval(updateCategoryVisibility, 5000); // Run every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default CategoryVisibilityUpdater;
