import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = ({ orders, onClose, onPaymentSuccess }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handlePaymentClick = async () => {
    if (!selectedPayment) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    try {
      const unpaidOrders = orders.filter(order => order.paymentstatus === "Chưa thanh toán");

      if (selectedPayment === 'Stripe') {
        const items = unpaidOrders.flatMap(order =>
          order.products.map(product => ({
            name: product.title,
            amount: Math.round(product.price * 1000), // Đơn vị: VND
            quantity: product.foodQuantity,
            orderId: order._id,
            discountPrice: Math.round((order.discountprice || 0) * 1000) // Đơn vị: VND
          }))
        );
      
        const orderIds = unpaidOrders.map(order => order._id);
      
        if (items.length === 0) {
          toast.error("Không có đơn hàng nào cần thanh toán.");
          return;
        }
      
        const response = await axios.post('/api/creates-stripe-session', { items, orderIds });
        const { url } = response.data;
        window.location.href = url;
      
      } else if (selectedPayment === 'tienmat') {
        const updatePromises = unpaidOrders.map(order =>
          axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
            paymentstatus: 'Đang chờ xác nhận',
          })
        );

        await Promise.all(updatePromises);

        toast.success("Đã yêu cầu thanh toán tiền mặt đến nhân viên");
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else if (selectedPayment === 'VNPay' || selectedPayment === 'Momo') {
        setShowPopup(true);
      } else {
        toast.error("Phương thức thanh toán này chưa được hỗ trợ.");
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const unpaidOrders = orders.filter(order => order.paymentstatus === "Chưa thanh toán");

      const updatePromises = unpaidOrders.map(order =>
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
          paymentstatus: 'Đang chờ xác nhận',
        })
      );

      await Promise.all(updatePromises);

      toast.success("Đang chờ xác nhận!");
      setShowPopup(false);
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
      toast.error("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
    <div className="payment-modal">
      <div className="payment-container">
        <div className="payment-title">
          <h4>Vui lòng chọn phương thức <span style={{ color: '#6064b6' }}>thanh toán</span></h4>
        </div>
        <form className="payment-form">
          <input type="radio" name="payment" id="tienmat" onChange={() => handlePaymentSelect('tienmat')} />
          <input type="radio" name="payment" id="Stripe" onChange={() => handlePaymentSelect('Stripe')} />
          <input type="radio" name="payment" id="VNPay" onChange={() => handlePaymentSelect('VNPay')} />
          <input type="radio" name="payment" id="Momo" onChange={() => handlePaymentSelect('Momo')} />
          <div className="payment-category">
            <label htmlFor="tienmat" className={`payment-label tienmatMethod ${selectedPayment === 'tienmat' ? 'selected' : ''}`}>
              <div className="imgContainer tienmat">
                <Image src="https://cdn-icons-png.freepik.com/512/5132/5132194.png" alt="cash" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>Tiền mặt</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
            <label htmlFor="Stripe" className={`payment-label StripeMethod ${selectedPayment === 'Stripe' ? 'selected' : ''}`}>
              <div className="imgContainer Stripe">
                <Image src="https://www.cdnlogo.com/logos/s/83/stripe.svg" alt="Stripe" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>Stripe</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
            <label htmlFor="VNPay" className={`payment-label VNPayMethod ${selectedPayment === 'VNPay' ? 'selected' : ''}`}>
              <div className="imgContainer VNPay">
                <Image src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>VNPay</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
            <label htmlFor="Momo" className={`payment-label MomoMethod ${selectedPayment === 'Momo' ? 'selected' : ''}`}>
              <div className="imgContainer Momo">
                <Image src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" alt="Momo" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>Momo</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
          </div>
        </form>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600" onClick={handlePaymentClick}>Thanh toán</button>
          <button onClick={onClose} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">Đóng</button>
        </div>
        <ToastContainer />
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center max-w-md mx-auto">
            <h4 className="mb-4">Số Tiền bạn cần thanh toán là</h4>
            <h4>{formatCurrency(orders.reduce((total, order) => total + order.total, 0))}</h4>
            <div className="qr-code mb-4">
              {selectedPayment === 'VNPay' && <Image src="https://imgur.com/HQWd6Kn.png" alt="VNPay QR" width={200} height={200} />}
              {selectedPayment === 'Momo' && <Image src="https://imgur.com/TRKh58m.png" alt="Momo QR" width={200} height={200} />}
            </div>
            <div className="flex justify-center gap-4">
              <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600" onClick={handleConfirmPayment}>Xác nhận thanh toán</button>
              <button className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600" onClick={handleClosePopup}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
