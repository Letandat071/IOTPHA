import Order from '../../models/Order'; // Adjust the import path as needed

const getUnpaidOrdersCount = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const unpaidOrdersCount = await Order.countDocuments({ paymentstatus: { $ne: 'Đã thanh toán' } });
      res.status(200).json({ unpaidOrdersCount });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default getUnpaidOrdersCount;