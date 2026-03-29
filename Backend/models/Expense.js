import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  convertedAmount: { type: Number },
  category: { type: String, required: true },
  description: { type: String, required: true },
  receiptUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvals: [
    {
      approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['Approved', 'Rejected'] },
      comment: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
