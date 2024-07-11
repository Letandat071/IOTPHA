import { useEffect, useState, useCallback } from "react";
import Title from "../ui/Title";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../ui/ConfirmModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Order = ({ newOrdersCount }) => {
  const [orders, setOrders] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const status = ["Đã Nhận", "Đang Chuẩn Bị", "Đã Ra Món"];

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Fetch orders every 10 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (newOrdersCount > 0) {
      fetchOrders();
    }
  }, [newOrdersCount, fetchOrders]);

  const formatCurrency = (amount) => {
    const parts = parseFloat(amount).toFixed(3).split('.');
    const integerPart = parts[0];
    let decimalPart = parts[1];
    decimalPart = decimalPart.padEnd(3, '0');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger}.${decimalPart} VNĐ`;
  };

  const handleStatusNext = async (id) => {
    const item = orders.find((order) => order._id === id);
    const currentStatus = item.status;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status: currentStatus + 1 }
      );
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: currentStatus + 1 } : order
        )
      );
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleStatusPrior = async (id) => {
    const item = orders.find((order) => order._id === id);
    const currentStatus = item.status;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status: currentStatus - 1 }
      );
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: currentStatus - 1 } : order
        )
      );
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = (id) => {
    setOrderToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderToDelete}`
      );
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      if (res.data) {
        toast.success("Xoá Order Thành Công");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Đang chờ xác nhận" ? "Đã thanh toán" : "Đang chờ xác nhận";
      const res = await axios.put(`/api/orders/${id}`, { paymentstatus: newStatus });
      setOrders(orders.map(order => (order._id === id ? { ...order, paymentstatus: newStatus } : order)));
      toast.success("Cập nhật thanh toán thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thanh toán thất bại");
    }
  };


  return (
    <div className="lg:p-8 p-4 flex-1 lg:mt-0 relative min-h-[400px] lg:max-w-[70%] xl:max-w-none flex flex-col justify-center bg-white-50 rounded-lg shadow-lg overflow-hidden">
  <Title addClass="text-[40px] text-center text-black">Đơn Hàng</Title>
  <div className="overflow-x-auto mt-5">
    <div className="max-h-[700px] overflow-y-auto">
      <table className="min-w-full text-sm text-center text-gray-900">
        <thead className="text-xs text-gray-900 uppercase bg-gray-200">
          <tr>
            {/* <th scope="col" className="py-3 px-2 lg:px-4">ID</th> */}
            <th scope="col" className="py-3 px-2 lg:px-4">Bàn</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Tên Khách</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Món Ăn</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Giá</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Thanh Toán</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Trạng Thái</th>
            <th scope="col" className="py-3 px-2 lg:px-4">Cập Nhật Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <tr
                  className="transition-all bg-white border-gray-700 hover:bg-slate-200"
                  key={order._id}
                >
                  {/* <td className="py-4 px-2 lg:px-4 font-medium whitespace-nowrap hover:text-gray-800 align-top">
                  {order?._id ? order._id.substring(0, 7) : "N/A"}
                </td> */}
                  <td className="py-4 px-2 lg:px-4 font-medium whitespace-nowrap hover:text-gray-800 align-text-top">
                    {order?.tablename}
                  </td>
                  <td className="py-4 px-2 lg:px-4 font-medium whitespace-nowrap hover:text-gray-800 align-text-top">
                    {order?.customer}
                  </td>
                  <td className="py-4 px-2 lg:px-4 font-medium hover:text-gray-800 flex-wrap w-[100px] whitespace-nowrap ">
                    {order?.products ? (
                      order.products.map((product, index) => (
                        <span key={index}>
                          {product.title} * {product.foodQuantity} <br />
                        </span>
                      ))
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-2 lg:px-4 font-medium whitespace-nowrap  hover:text-gray-800 align-text-top">
                    {order?.total ? formatCurrency(order.total) : "N/A"}
                  </td>
                  <td className="font-medium whitespace-nowrap hover:text-gray-800  flex items-center flex-col align-top">
                    {order?.paymentstatus}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={order.paymentstatus === "Đã thanh toán"}
                        onChange={() => toggleStatus(order._id, order.paymentstatus)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </td>

                  <td className="py-4 px-2 lg:px-4 font-medium whitespace-nowrap hover:text-gray-800 align-text-top">
                    {status[order?.status]}
                  </td>
                  <td className="py-4 px-1 font-small whitespace-nowrap hover:text-gray-800 flex gap-3 items-center justify-center mt-3">
                    <button
                      className="btn-primary !bg-green-700 w-12 !pl-0 !pr-0 relative group"
                      onClick={() => handleStatusPrior(order?._id)}
                      disabled={order?.status < 1}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      <span className="tooltip group-hover:opacity-100 transition-opacity duration-300 absolute bg-gray-700 text-white text-xs rounded-lg py-1 px-1 bottom-full left-1/2 transform -translate-x-1/2 opacity-0">
                        Trạng Thái Trước
                      </span>
                    </button>
                    <button
                      className="btn-primary !bg-yellow-600 w-14 !pl-0 !pr-0 relative group"
                      onClick={() => handleDelete(order?._id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                      <span className="tooltip group-hover:opacity-100 transition-opacity duration-300 absolute bg-gray-700 text-white text-xs rounded-lg py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 opacity-0">
                        Xóa Order
                      </span>
                    </button>
                    <button
                      className="btn-primary !bg-green-700 w-12 !pl-0 !pr-0 relative group"
                      onClick={() => handleStatusNext(order?._id)}
                      disabled={order?.status > 1}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                      <span className="tooltip group-hover:opacity-100 transition-opacity duration-300 absolute bg-gray-700 text-white text-xs rounded-lg py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 opacity-0">
                        Trạng Thái Sau
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  </div>
  <ConfirmModal
    isOpen={isConfirmModalOpen}
    onClose={() => setIsConfirmModalOpen(false)}
    onConfirm={confirmDelete}
    message="Bạn có muốn xóa Order này không?"
  />
</div>



  );
};

export default Order;
