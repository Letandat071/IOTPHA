// models/Table.js

import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'deactive'],
    default: 'deactive',
  },
}, { timestamps: true });

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
