// pages/api/checkTableStatus.js
import mongoose from 'mongoose';
import Table from '../../../models/Table';  // Make sure the import path is correct

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGODB_URI);
  const { tableName } = req.query;

  try {
    const table = await Table.findOne({ tableName });
    res.status(200).json({ status: table ? table.status : 'not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
