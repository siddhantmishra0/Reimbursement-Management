import mongoose from 'mongoose';

const approvalRecordSchema = new mongoose.Schema({
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['Approved', 'Rejected'], required: true },
  comment: { type: String },
  stepIndex: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const expenseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  convertedAmount: { type: Number },
  category: { type: String, required: true },
  description: { type: String, required: true },
  receiptUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvalFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalFlow', required: true },
  currentStepIndex: { type: Number, default: 0 },
  approvals: [approvalRecordSchema]
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
