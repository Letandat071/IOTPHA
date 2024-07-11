import { useEffect, useState, useCallback } from "react";
import Title from "../ui/Title";
import Image from "next/image";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from "../ui/ConfirmModal";

const Products = () => {
  const [isProductModal, setIsProductModal] = useState(false);
  const [isEditProductModal, setIsEditProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // const getProducts = async () => {
  //   try {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  //     setProducts(res.data);
  //     setFilteredProducts(res.data);
  //     const uniqueCategories = [...new Set(res.data.map(product => product.category))];
  //     setCategories(uniqueCategories);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getProducts();
  // }, []);

  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(res.data);
      setFilteredProducts(res.data);
      const uniqueCategories = [...new Set(res.data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải dữ liệu sản phẩm", {
        position: "top-left",
        theme: "colored",
      });
    }
  }, []);

  useEffect(() => {
    getProducts();
    const intervalId = setInterval(() => {
      getProducts();
    }, 50000); 

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [getProducts]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategories]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productToDelete}`);
      if (res.status === 200) {
        toast.success("Sản phẩm xóa thành công");
        getProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi gì đó xảy ra");
    } finally {
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditProductModal(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${updatedProduct._id}`,
        updatedProduct
      );
      if (res.status === 200) {
        toast.success("Cập nhật sản phẩm thành công");
        getProducts();
        setIsEditProductModal(false);
      } else {
        toast.error("Cập nhật sản phẩm thất bại");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  const handleQuantityChange = async (productId, change) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, product.soLuong + change);
    if (newQuantity === product.soLuong) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        { ...product, soLuong: newQuantity }
      );
      if (res.status === 200) {
        setProducts(prevProducts => prevProducts.map(p =>
          p._id === productId ? { ...p, soLuong: newQuantity } : p
        ));
        setFilteredProducts(prevFiltered => prevFiltered.map(p =>
          p._id === productId ? { ...p, soLuong: newQuantity } : p
        ));
        toast.success("Cập nhật số lượng thành công", {
          position: "top-left",
          theme: "light",
        });
      } else {
        toast.error("Cập nhật số lượng thất bại", {
          position: "top-left",
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng", {
        position: "top-left",
        theme: "colored",
      });
    }
  };

  const handleQuantityInputChange = async (productId, newQuantity) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const quantity = newQuantity === '' ? 0 : Math.max(0, parseInt(newQuantity, 10));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        { ...product, soLuong: quantity }
      );
      if (res.status === 200) {
        setProducts(prevProducts => prevProducts.map(p =>
          p._id === productId ? { ...p, soLuong: quantity } : p
        ));
        setFilteredProducts(prevFiltered => prevFiltered.map(p =>
          p._id === productId ? { ...p, soLuong: quantity } : p
        ));
        toast.success("Cập nhật số lượng thành công", {
          position: "top-left",
          theme: "light",
        });
      } else {
        toast.error("Cập nhật số lượng thất bại", {
          position: "top-left",
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng", {
        position: "top-left",
        theme: "colored",
      });
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSelectAllCategories = () => {
    if (isAllSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories);
    }
    setIsAllSelected(!isAllSelected);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="lg:p-8 p-4 flex-1 lg:mt-0 relative min-h-[400px] w-full flex flex-col justify-center bg-white-50 rounded-lg shadow-lg">
      <Title addClass="text-[40px] text-center text-black">Món Ăn</Title>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-5 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <div className="relative inline-block text-left z-20">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={toggleDropdown}
            >
              Chọn danh mục
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L10 5.414 5.707 9.707a1 1 0 11-1.414-1.414l5-5A1 1 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  onClick={handleSelectAllCategories}
                >
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllCategories}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Chọn tất cả</span>
                </button>
                {categories.map((category) => (
                  <label key={category} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 w-full h-[calc(100vh-200px)] overflow-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Món Ăn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Danh mục
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image className="h-10 w-10 rounded-full" src={product.img} alt="" width={40} height={40} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(product.prices[0])} VNĐ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 bg-gray-200 rounded"
                          onClick={() => handleQuantityChange(product._id, -1)}
                        >
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        <input
                          type="number"
                          className="w-16 text-sm text-center border border-gray-300 rounded"
                          value={product.soLuong}
                          onChange={(e) => handleQuantityInputChange(product._id, e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                          onBlur={(e) => handleQuantityInputChange(product._id, e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        />
                        <button
                          className="p-1 bg-gray-200 rounded"
                          onClick={() => handleQuantityChange(product._id, 1)}
                        >
                          <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                      </div>
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900 mr-2"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => handleEdit(product)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isProductModal && <AddProduct setIsProductModal={setIsProductModal} />}
      {isEditProductModal && (
        <EditProduct
          setIsEditProductModal={setIsEditProductModal}
          selectedProduct={selectedProduct}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="Bạn có chắc là xóa sản phẩm này chứ?"
      />
      <button
        className="btn-green w-12 h-12 !p-0 bottom-14 right-14 text-4xl text-center absolute bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg transition duration-300"
        onClick={() => setIsProductModal(true)}
      >
        +
      </button>
    </div>
  );
};

export default Products;
