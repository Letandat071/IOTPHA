import dbConnect from '../../../util/dbConnect';
import Table from '../../../models/Table';

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const table = await Table.findById(id);
        if (!table) {
          return res.status(404).json({ success: false, message: 'Table not found' });
        }
        res.status(200).json({ success: true, data: table });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const table = await Table.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        if (!table) {
          return res.status(404).json({ success: false, message: 'Table not found' });
        }
        res.status(200).json({ success: true, data: table });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const deletedTable = await Table.deleteOne({ _id: id });
        if (!deletedTable) {
          return res.status(404).json({ success: false, message: 'Table not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
};

export default handler;
