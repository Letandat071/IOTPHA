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
      // Kiểm tra xem dữ liệu trong db có hợp lệ hay không và thông báo kết quả
      res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
      res.render('success', { code: '97' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
