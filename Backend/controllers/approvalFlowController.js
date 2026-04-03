import ApprovalFlow from '../models/ApprovalFlow.js';

// @desc    Get all approval flows for a company
// @route   GET /api/approval-flows
// @access  Private/Admin
export const getApprovalFlows = async (req, res) => {
  try {
    const flows = await ApprovalFlow.find({ companyId: req.user.companyId })
      .populate('steps.specificApproverId', 'name email');
    res.json(flows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new approval flow
// @route   POST /api/approval-flows
// @access  Private/Admin
export const createApprovalFlow = async (req, res) => {
  try {
    const { name, isDefault, steps } = req.body;

    // Logic: if marked as default, unset previous default
    if (isDefault) {
      await ApprovalFlow.updateMany(
        { companyId: req.user.companyId },
        { isDefault: false }
      );
    }

    // Logic: if it's the first flow for this company, force it to be default
    const count = await ApprovalFlow.countDocuments({ companyId: req.user.companyId });
    const finalIsDefault = count === 0 ? true : isDefault;

    const flow = await ApprovalFlow.create({
      companyId: req.user.companyId,
      name,
      isDefault: finalIsDefault,
      steps: steps || []
    });

    const populatedFlow = await ApprovalFlow.findById(flow._id).populate('steps.specificApproverId', 'name email');
    res.status(201).json(populatedFlow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an approval flow
// @route   PUT /api/approval-flows/:id
// @access  Private/Admin
export const updateApprovalFlow = async (req, res) => {
  try {
    const { name, isDefault, steps } = req.body;

    const flow = await ApprovalFlow.findById(req.params.id);

    if (!flow) {
      return res.status(404).json({ message: 'Approval Flow not found' });
    }

    if (flow.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (isDefault && !flow.isDefault) {
      await ApprovalFlow.updateMany(
        { companyId: req.user.companyId, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    // Prevent removing default status if there are no other defaults
    let finalIsDefault = isDefault;
    if (!isDefault && flow.isDefault) {
      const otherDefaults = await ApprovalFlow.countDocuments({ 
        companyId: req.user.companyId, 
        _id: { $ne: req.params.id }, 
        isDefault: true 
      });
      if (otherDefaults === 0) {
        // Can't un-default the only default flow
        return res.status(400).json({ message: 'You must have at least one default flow.' });
      }
    }

    flow.name = name || flow.name;
    flow.isDefault = finalIsDefault !== undefined ? finalIsDefault : flow.isDefault;
    if (steps) {
      flow.steps = steps;
    }

    await flow.save();

    const populatedFlow = await ApprovalFlow.findById(flow._id).populate('steps.specificApproverId', 'name email');
    res.json(populatedFlow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an approval flow
// @route   DELETE /api/approval-flows/:id
// @access  Private/Admin
export const deleteApprovalFlow = async (req, res) => {
  try {
    const flow = await ApprovalFlow.findById(req.params.id);

    if (!flow) {
      return res.status(404).json({ message: 'Approval Flow not found' });
    }

    if (flow.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (flow.isDefault) {
       return res.status(400).json({ message: 'Cannot delete the default flow. Make another flow default first.' });
    }

    await flow.deleteOne();
    res.json({ message: 'Approval flow removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
