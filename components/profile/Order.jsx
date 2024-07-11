import React, { useEffect, useState, useCallback } from "react";
import Title from "../ui/Title";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';

const Payment = dynamic(() => import('./Payment '), { ssr: false });
const BillPopup = dynamic(() => import('./BillPopup'), { ssr: false });

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const getOrders = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        setOrders(
          res.data.filter((order) => order.id_customer === session.user.id)
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [session]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const { session_id } = router.query;
      if (session_id) {
        try {
          const response = await axios.get(`/api/stripe-sessions/${session_id}`);
          const orderIds = response.data.metadata.orderIds.split(',');

          const updatePromises = orderIds.map(orderId =>
            axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
              paymentstatus: 'Đã thanh toán',
            })
          );

          await Promise.all(updatePromises);

          setPaymentSuccess(true);
          await getOrders();
          
          // Remove the session_id from the URL
          router.replace(router.pathname, undefined, { shallow: true });

          // Show success popup only once
          Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công!',
            text: 'Tất cả đơn hàng đã được thanh toán thành công.',
            confirmButtonColor: '#4CAF50', // Màu xanh lá
            confirmButtonText: 'OK'
          });
        } catch (error) {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi xảy ra',
            text: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.',
          });
        }
      }
    };

    if (router.query.session_id) {
      handlePaymentSuccess();
    }
  }, [router.query.session_id, getOrders, router]);

  const handleSubmitPayment = () => {
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    getOrders();
  };

  const handlePrintBill = () => {
    setShowBillPopup(true);
  };

  const handleCloseBillPopup = () => {
    setShowBillPopup(false);
  };

  const formatCurrency = (amount) => {
    const parts = parseFloat(amount).toFixed(3).split('.');
    const integerPart = parts[0];
    let decimalPart = parts[1];
    decimalPart = decimalPart.padEnd(3, '0');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger}.${decimalPart} VNĐ`;
  };


  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5">
      <Title addClass="text-[40px]">Menu đã đặt hàng</Title>
      <div className="overflow-x-auto w-full mt-5">
        <table className="w-full text-sm text-center text-gray-500 xl:min-w-[1000px]">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">Mã</th>
              <th scope="col" className="py-3 px-6">Ngày</th>
              <th scope="col" className="py-3 px-6">Thực Đơn</th>
              <th scope="col" className="py-3 px-6">Trạng thái</th>
              <th scope="col" className="py-3 px-6">Thanh Toán</th>
              <th scope="col" className="py-3 px-6">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                className="transition-all bg-secondary border-gray-700 hover:bg-primary cursor-pointer"
                key={order._id}
                onClick={() => router.push(`/order/${order._id}`)}
              >
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center gap-x-1 justify-center">
                  <span>{order._id.substring(0, 5)}...</span>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {order.createdAt.substring(0, 10)} {order.createdAt.substring(11, 16)}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.title} - Số lượng: {product.foodQuantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {(order.status === 0 && "Đã nhận") ||
                    (order.status === 1 && "Đang chuẩn bị") ||
                    (order.status === 2 && "Đã Ra Món")}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {order.paymentstatus}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {formatCurrency(order.total)} 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Thanh toán</h2>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={handleSubmitPayment}
          >
            Thanh Toán
          </button>
        </div>
        <div>
          <button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={handlePrintBill}
          >
            In bill
          </button>
        </div>
      </div>
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Payment
            orders={orders.filter(order => order.paymentstatus === "Chưa thanh toán")}
            onClose={handleClosePayment}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      )}
      {showBillPopup && (
        <BillPopup
          orders={orders}
          onClose={handleCloseBillPopup}
        />
      )}
    </div>
  );
};

export default Order;