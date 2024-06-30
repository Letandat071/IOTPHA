import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = ({ orders, onClose, onPaymentSuccess }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handlePaymentClick = async () => {
    if (!selectedPayment) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    try {
      if (selectedPayment === 'VNPay') {
        const unpaidOrders = orders.filter(order => order.paymentstatus === "Chưa thanh toán");
        const amount = unpaidOrders.reduce((total, order) => total + order.amount, 0);
        const orderId = unpaidOrders[0]._id;
        const orderDescription = "Thanh toan don hang";
        const orderType = "billpayment";
        const language = "vn";

        const response = await axios.post('/api/create_payment', { amount, orderId, orderDescription, orderType, language });
        const { paymentUrl } = response.data;

        window.location.href = paymentUrl;
      } else if (selectedPayment === 'tienmat') {
        const unpaidOrders = orders.filter(order => order.paymentstatus === "Chưa thanh toán");
        const updatePromises = unpaidOrders.map(order =>
          axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
            paymentstatus: 'Đang chờ xác nhận',
          })
        );

        await Promise.all(updatePromises);

        toast.success("Đã yêu gửi cầu thanh toán tiền mặt đến nhân viên");
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        toast.error("Phương thức thanh toán này chưa được hỗ trợ.");
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error); // Log lỗi để kiểm tra
      toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-container">
        <div className="payment-title">
          <h4>Vui lòng chọn phương thức <span style={{ color: '#6064b6' }}>thanh toán</span></h4>
        </div>
        <form className="payment-form">
          <input type="radio" name="payment" id="tienmat" onChange={() => handlePaymentSelect('tienmat')} />
          <input type="radio" name="payment" id="VNPay" onChange={() => handlePaymentSelect('VNPay')} />
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
            <label htmlFor="VNPay" className={`payment-label VNPayMethod ${selectedPayment === 'VNPay' ? 'selected' : ''}`}>
              <div className="imgContainer VNPay">
                <Image src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>VNPay</span>
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
    </div>
  );
};

export default Payment;
