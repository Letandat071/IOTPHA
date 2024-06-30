import crypto from 'crypto';
import querystring from 'querystring';

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, orderId, orderDescription, orderType, language, bankCode } = req.body;
    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url = process.env.VNPAY_URL;
    const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL;

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const date = new Date();
    const createDate = date.toISOString().slice(0, 19).replace(/-/g, '').replace(/:/g, '').replace('T', '');
    const orderIdGenerated = createDate.slice(8) + orderId;

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: language || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderIdGenerated,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100, // nhân với 100 để chuyển sang đồng
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params, { encode: true })}`;

    console.log('Payment URL:', paymentUrl); // Log URL thanh toán để kiểm tra
    console.log('VNPay Params:', vnp_Params); // Log các tham số gửi đi

    res.status(200).json({ paymentUrl });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
