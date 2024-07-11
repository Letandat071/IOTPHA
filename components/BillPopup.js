import React from 'react';
import dynamic from 'next/dynamic';

const BillPopup = ({ order, onClose }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();

  const formatCurrency = (amount) => {
    const parts = parseFloat(amount).toFixed(3).split('.');
    const integerPart = parts[0];
    let decimalPart = parts[1];

    decimalPart = decimalPart.padEnd(3, '0');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${formattedInteger}.${decimalPart} VNĐ`;
  };

  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      const jsPDF = (await import('jspdf')).default;
      const OpenSansItalic = (await import('../models/OpenSans-Italic-normal')).default;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const lineHeight = 10;
      let cursorY = margin;

      // Add custom font
      pdf.addFileToVFS('OpenSans-Italic.ttf', OpenSansItalic);
      pdf.addFont('OpenSans-Italic.ttf', 'OpenSans-Italic', 'normal');
      pdf.setFont('OpenSans-Italic');

      // Add title
      pdf.setFontSize(18);
      pdf.text('Hóa đơn', pageWidth / 2, cursorY, { align: 'center' });
      cursorY += lineHeight;

      pdf.setFontSize(12);
      pdf.text(`Ngày giờ: ${formattedDate}`, margin, cursorY);
      cursorY += lineHeight;
      pdf.text(`Khách hàng: ${order.customer}`, margin, cursorY);
      cursorY += lineHeight;
      pdf.text(`Số bàn: ${order.tablename}`, margin, cursorY);
      cursorY += lineHeight + 5;

      // Add list header
      pdf.setFontSize(14);
      pdf.text('Danh sách món ăn:', margin, cursorY);
      cursorY += lineHeight;

      // Add each product
      pdf.setFontSize(12);
      order.products.forEach((item) => {
        if (cursorY + lineHeight > pageHeight - margin) {
          pdf.addPage();
          cursorY = margin;
        }
        pdf.text(`${item.title} - ${item.foodQuantity} x ${formatCurrency(item.price)} VNĐ`, margin, cursorY);
        cursorY += lineHeight;
      });

      cursorY += 5;

      // Add total amount
      if (cursorY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.setFontSize(14);
      pdf.text(`Tổng số tiền: ${formatCurrency(order.total)}`, margin, cursorY);
      cursorY += lineHeight;
      pdf.setFontSize(12);
      pdf.text(`Thanh Toán: ${order.paymentstatus}`, margin, cursorY);

      const formattedDateTime = currentDate.toISOString().replace(/[:.]/g, '-');
      const fileName = `Hóa Đơn_${formattedDateTime}_${order.customer}_bàn_${order.tablename}.pdf`;

      pdf.save(fileName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="text-lg font-semibold border-b pb-4">Hóa đơn</div>
        <div className="py-4" id="bill-content">
          <p><strong>Ngày giờ:</strong> {formattedDate}</p>
          <p><strong>Khách hàng:</strong> {order.customer}</p>
          <p><strong>Số bàn:</strong> {order.tablename}</p>
          <h5 className="font-semibold mt-3 mb-2">Danh sách món ăn:</h5>
          <div className="max-h-40 overflow-y-auto mb-4">
            <ul className="list-disc pl-5">
              {order.products.map((item, index) => (
                <li key={index} className="mb-1">{item.title} - {item.foodQuantity} x {formatCurrency(item.price)} VNĐ</li>
              ))}
            </ul>
          </div>
          <p><strong>Tổng số tiền:</strong> {formatCurrency(order.total)}</p>
          <p><strong>Trạng Thái:</strong> {order.paymentstatus}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Đóng</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">In hóa đơn</button>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(BillPopup), { ssr: false });