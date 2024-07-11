import React, { useState, useMemo } from "react";
import Title from "../ui/Title";
import MenuItem from "./MenuItem";

const MenuWrapper = ({ categoryList = [], productList = [] }) => {
  const [active, setActive] = useState(0);
  const [productLimit, setProductLimit] = useState(3);

  // Lọc các danh mục có visible là true
  const visibleCategoryList = useMemo(() => categoryList.filter(category => category.visible), [categoryList]);

  // Lọc sản phẩm theo danh mục hiện tại
  const filteredProducts = useMemo(() => {
    if (visibleCategoryList.length > 0) {
      return productList.filter(
        (product) =>
          product.category.toLowerCase() === visibleCategoryList[active].title.toLowerCase() &&
        product.soLuong !== 0
      );
    }
    return [];
  }, [productList, visibleCategoryList, active]);

  return (
    <div className="container mx-auto mb-16">
      <div className="flex flex-col items-center w-full">
        <Title addClass="text-[40px]">Thực Đơn</Title>
        <div className="mt-10">
          {visibleCategoryList.map((category, index) => (
            <button
              className={`px-6 py-2 ${index === active ? "bg-secondary text-white" : ""} ml-4 rounded-3xl`}
              key={category._id}
              onClick={() => {
                setActive(index);
                setProductLimit(3);
              }}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 min-h-[450px]">
        {filteredProducts.slice(0, productLimit).map((product) => (
          <MenuItem key={product._id} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-center my-8">
        <button
          className="btn-primary"
          onClick={() => setProductLimit(productLimit + 3)}
        >
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default MenuWrapper;
