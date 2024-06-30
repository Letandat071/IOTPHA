// pages/api/tables/index.js

import dbConnect from '../../../util/dbConnect';
import Table from '../../../models/Table';

dbConnect();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    try {
      const tables = await Table.find();
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (method === 'POST') {
    try {
      const newTable = await Table.create(req.body);
      res.status(201).json(newTable);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
