import mongoose from 'mongoose';

// Approval history schema (from approval-workflow)
const approvalRecordSchema = new mongoose.Schema({
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['Approved', 'Rejected'], required: true },
  comment: { type: String },
  stepIndex: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const expenseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Keep companyId (important for multi-company setups)
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

  amount: { type: Number, required: true },

  // Merge: keep default from main
  currency: { type: String, required: true, default: 'USD' },

  convertedAmount: { type: Number },
  exchangeRate: { type: Number },   // rate stored at submission time for audit
  category: { type: String, required: true },
  description: { type: String, required: true },
  receiptUrl: { type: String },

  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },

  // From approval-workflow (more advanced system)
  approvalFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalFlow', required: true },
  currentStepIndex: { type: Number, default: 0 },

  // Use structured approval history instead of simple array
  approvals: [approvalRecordSchema]

}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);