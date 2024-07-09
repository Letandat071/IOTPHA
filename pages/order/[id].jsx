// pages/orders/[id].js
import axios from 'axios';
import { useState, useEffect } from 'react';
import Payment from '../../components/payment';
import BillPopup from '../../components/BillPopup';
import Swal from 'sweetalert2';

const Order = ({ order }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    if (paymentStatus === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Thanh toán thành công!',
        confirmButtonColor: '#4CAF50', // Màu xanh lá
        confirmButtonText: 'OK',
        // timer: 1500,
      });

      // Cập nhật trạng thái thanh toán
      axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
        paymentstatus: 'Đã thanh toán',
      }).then(() => {
        // Reload order data or update UI as needed
        window.location.href = window.location.origin + window.location.pathname; // Remove query params
      });
    }
  }, [order]);

  const handlePaymentClick = () => {
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setShowBill(true);

    // Cập nhật trạng thái thanh toán
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
      paymentstatus: 'Đã thanh toán',
    });
  };

  const handleCloseBill = () => {
    setShowBill(false);
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
    <div className="flex flex-col min-h-screen p-10">
      {showPayment && order && (
        <Payment
          onClose={handleClosePayment}
          onPaymentSuccess={handlePaymentSuccess}
          order={order}
        />
      )}
      {showBill && order && (
        <BillPopup
          order={order}
          onClose={handleCloseBill}
        />
      )}

      <div className="flex-grow overflow-x-auto">
        <div className="w-full mb-4">
          <table className="w-full text-sm text-center text-gray-500 ">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">MÃ</th>
                <th scope="col" className="py-3 px-6">BÀN</th>
                <th scope="col" className="py-3 px-6">KHÁCH HÀNG</th>
                <th scope="col" className="py-3 px-6">MÓN ĂN</th>
                <th scope="col" className="py-3 px-6">SỐ LƯỢNG</th>
                <th scope="col" className="py-3 px-6">TỔNG</th>
                <th scope="col" className="py-3 px-6">THANH TOÁN</th>
              </tr>
            </thead>
            <tbody>
              {order && order.products && order.products.length > 0 ? (
                order.products.map((product, index) => (
                  <tr key={index} className="transition-all bg-gray-100 border-gray-900 hover:bg-gray-100 group">
                    {index === 0 && (
                      <>
                        <td rowSpan={order.products.length} className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900 align-top">
                          {order._id.substring(0, 5)}
                        </td>
                        <td rowSpan={order.products.length} className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900 align-top">
                          {order.tablename}
                        </td>
                        <td rowSpan={order.products.length} className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900 align-top">
                          {order.customer}
                        </td>
                      </>
                    )}
                    <td className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900">
                      {product.title}
                    </td>
                    <td className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900">
                      {product.foodQuantity}
                    </td>
                    {index === 0 && (
                      <td rowSpan={order.products.length} className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900 align-top">
                        {formatCurrency(order.total)}
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={order.products.length} className="py-4 px-6 font-medium whitespace-nowrap group-hover:text-gray-900 align-top">
                        {order.paymentstatus}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 font-medium whitespace-nowrap hover:text-gray-900">
                    Không có món ăn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button className="btn-primary mr-5" onClick={handlePaymentSuccess}>In Hoá Đơn</button>
          <button className="btn-primary" 
            onClick={handlePaymentClick} 
            disabled={order.paymentstatus === "Đã thanh toán" || order.paymentstatus === "Đang chờ xác nhận"}
            title={`Hoá đơn của bạn đang ${order.paymentstatus}`}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`);
    return {
      props: {
        order: res.data.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching order data:', error);
    return {
      props: {
        order: null,
      },
    };
  }
};

export default Order;
