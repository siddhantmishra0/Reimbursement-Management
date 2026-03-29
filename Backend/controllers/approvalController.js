import Expense from '../models/Expense.js';
import ApprovalFlow from '../models/ApprovalFlow.js';
import User from '../models/User.js';

export const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id || req.user.id;
    
    // Find expense with employee populated
    const expense = await Expense.findById(id).populate('employeeId');
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    if (expense.status !== 'Pending') {
      return res.status(400).json({ message: 'Expense is already processed' });
    }

    // Check if user has already approved THIS step
    const alreadyApproved = expense.approvals.some(
      (a) => a.approverId.toString() === userId.toString() && a.stepIndex === expense.currentStepIndex
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: 'You have already approved this step' });
    }

    const flow = await ApprovalFlow.findById(expense.approvalFlowId);
    if (!flow) return res.status(404).json({ message: 'Approval flow not found' });

    const currentStep = flow.steps[expense.currentStepIndex];
    if (!currentStep) return res.status(400).json({ message: 'Invalid approval step configuration' });

    // Validate the approver is allowed for this step
    let isValidApprover = false;
    let poolSize = 1;

    if (currentStep.ruleType === 'Sequential' && currentStep.requiredRole === 'Manager') {
       if (expense.employeeId.managerId && expense.employeeId.managerId.toString() === userId.toString()) {
           isValidApprover = true;
       }
    } else if (currentStep.ruleType === 'Sequential' && currentStep.requiredRole !== 'Manager') {
        if (req.user.role === currentStep.requiredRole || currentStep.requiredRole === 'Any') {
            isValidApprover = true;
        }
    } else if (currentStep.ruleType === 'SpecificApprover') {
       if (currentStep.specificApproverId && currentStep.specificApproverId.toString() === userId.toString()) {
           isValidApprover = true;
       }
    } else if (currentStep.ruleType === 'Percentage' || currentStep.ruleType === 'Hybrid') {
       // Is the user in the required role?
       if (req.user.role === currentStep.requiredRole || currentStep.requiredRole === 'Any') {
           isValidApprover = true;
           const query = { companyId: expense.companyId };
           if (currentStep.requiredRole !== 'Any') query.role = currentStep.requiredRole;
           poolSize = await User.countDocuments(query);
       }

       if (currentStep.ruleType === 'Hybrid' && !isValidApprover) {
           // Also specific approver can approve in hybrid
           if (currentStep.specificApproverId && currentStep.specificApproverId.toString() === userId.toString()) {
               isValidApprover = true;
           }
       }
    }

    if (!isValidApprover) {
        return res.status(403).json({ message: 'You are not authorized to approve this step' });
    }

    // Record the approval
    expense.approvals.push({
      approverId: userId,
      action: 'Approved',
      comment: comment || '',
      stepIndex: expense.currentStepIndex,
      date: new Date()
    });

    // Evaluate step completion
    let stepComplete = false;
    
    if (currentStep.ruleType === 'Sequential' || currentStep.ruleType === 'SpecificApprover') {
        stepComplete = true; // One valid approval completes the step
    } else if (currentStep.ruleType === 'Percentage') {
        const stepApprovalsCount = expense.approvals.filter(
            a => a.action === 'Approved' && a.stepIndex === expense.currentStepIndex
        ).length; 
        const requiredApprovals = Math.ceil((currentStep.percentageRequired / 100) * poolSize);
        if (stepApprovalsCount >= requiredApprovals) {
            stepComplete = true;
        }
    } else if (currentStep.ruleType === 'Hybrid') {
        if (currentStep.specificApproverId && currentStep.specificApproverId.toString() === userId.toString()) {
            stepComplete = true; // Instant approval
        } else {
             const stepApprovalsCount = expense.approvals.filter(
               a => a.action === 'Approved' && a.stepIndex === expense.currentStepIndex
             ).length;
             const requiredApprovals = Math.ceil((currentStep.percentageRequired / 100) * poolSize);
             if (stepApprovalsCount >= requiredApprovals) {
                 stepComplete = true;
             }
        }
    }

    if (stepComplete) {
        if (expense.currentStepIndex + 1 < flow.steps.length) {
            expense.currentStepIndex += 1;
        } else {
            expense.status = 'Approved';
        }
    }

    await expense.save();
    return res.status(200).json({ message: 'Expense approved', expense, stepComplete, newStatus: expense.status });

  } catch (error) {
    console.error('Approval Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const rejectExpense = async (req, res) => {
  try {
     const { id } = req.params;
     const { comment } = req.body;
     const userId = req.user._id || req.user.id;

     if (!comment) {
         return res.status(400).json({ message: 'Rejection requires a comment' });
     }

     const expense = await Expense.findById(id);
     if (!expense) return res.status(404).json({ message: 'Expense not found' });

     if (expense.status !== 'Pending') {
        return res.status(400).json({ message: 'Expense is already processed' });
     }

     // Anyone technically eligible to approve can reject. We could add validation here,
     // but commonly any assigned approver rejecting terminates it. MVP simplifies this.
     
     expense.approvals.push({
         approverId: userId,
         action: 'Rejected',
         comment,
         stepIndex: expense.currentStepIndex,
         date: new Date()
     });

     expense.status = 'Rejected';
     await expense.save();

     return res.status(200).json({ message: 'Expense rejected', expense });
  } catch (error) {
     console.error('Rejection Error:', error);
     return res.status(500).json({ message: 'Server Error' });
  }
};
