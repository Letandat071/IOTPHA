import { useEffect, useState } from "react";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = (id) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productToDelete}`
      );
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
        setProducts(products.map(p => 
          p._id === productId ? { ...p, soLuong: newQuantity } : p
        ));
        toast.success("Cập nhật số lượng thành công",{
          position: "top-left",
          theme:"light",
        });
      } else {
        toast.error("Cập nhật số lượng thất bại",{
          position: "top-left",
          theme:"colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng",{
        position: "top-left",
        theme:"colored",
      });
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return ( 
     <div className="lg:p-8 p-4 flex-1 lg:mt-0 relative min-h-[400px] w-full flex flex-col justify-center bg-white-50 rounded-lg shadow-lg">
      <Title addClass="text-[40px] text-center text-black">Món Ăn</Title>
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
                {products.map((product) => (
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
                        <span className="text-sm text-gray-900">{product.soLuong}</span>
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