import crypto from 'crypto';
// import { sortObject } from '../../../utils/sortObject';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode'];

      // Kiểm tra dữ liệu có hợp lệ không và cập nhật trạng thái đơn hàng
      if (rspCode === '00') {
        // Cập nhật trạng thái đơn hàng thành công
        // Tùy thuộc vào cấu trúc dữ liệu của bạn, cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
        res.status(200).json({ RspCode: '00', Message: 'success' });
      } else {
        // Xử lý khi giao dịch không thành công
        res.status(200).json({ RspCode: '01', Message: 'Transaction failed' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
