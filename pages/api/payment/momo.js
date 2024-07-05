import { generateSignature, MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY } from '../../../util/momo';
import https from 'https';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, orderId, orderInfo, redirectUrl, ipnUrl, extraData, requestType } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!ipnUrl) {
      return res.status(400).json({ error: 'ipnUrl is required' });
    }

    const requestId = `${MOMO_PARTNER_CODE}-${Date.now()}`;
    const orderIdMomo = `${MOMO_PARTNER_CODE}-${Date.now()}-${orderId}`;

    const params = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderIdMomo,
      orderInfo: orderInfo,
      returnUrl: redirectUrl,
      notifyUrl: ipnUrl, // Đảm bảo sử dụng notifyUrl thay vì ipnUrl
      extraData: extraData,
      requestType: requestType,
    };

    const signature = generateSignature(params, MOMO_SECRET_KEY);

    const requestBody = JSON.stringify({
      ...params,
      signature: signature,
      lang: 'vi'
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const momoRequest = https.request(options, (momoResponse) => {
      let data = '';
      momoResponse.on('data', (chunk) => {
        data += chunk;
      });
      momoResponse.on('end', () => {
        console.log('MoMo response:', data);
        if (momoResponse.statusCode === 200) {
          const result = JSON.parse(data);
          res.status(200).json(result);
        } else {
          res.status(momoResponse.statusCode).json({ error: 'Error from MoMo', data: JSON.parse(data) });
        }
      });
    });

    momoRequest.on('error', (e) => {
      console.error('Error in MoMo request:', e);
      res.status(500).json({ error: e.message });
    });

    momoRequest.write(requestBody);
    momoRequest.end();
  } catch (error) {
    console.error('Error in MoMo API route:', error);
    res.status(500).json({ error: error.message });
  }
};
