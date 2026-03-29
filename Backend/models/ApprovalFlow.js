import mongoose from 'mongoose';

const approvalStepSchema = new mongoose.Schema({
  stepName: { type: String, required: true },
  ruleType: { 
    type: String, 
    enum: ['Sequential', 'Percentage', 'SpecificApprover', 'Hybrid'], 
    required: true 
  },
  requiredRole: { 
    type: String, 
    enum: ['Manager', 'Admin', 'Employee', 'Any'],
    default: 'Any'
  },
  percentageRequired: { type: Number }, // For Percentage / Hybrid rules
  specificApproverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // For SpecificApprover / Hybrid
});

const approvalFlowSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  steps: [approvalStepSchema]
}, { timestamps: true });

export default mongoose.model('ApprovalFlow', approvalFlowSchema);
