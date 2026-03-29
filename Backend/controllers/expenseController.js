import Expense from '../models/Expense.js';
import User from '../models/User.js';
import ApprovalFlow from '../models/ApprovalFlow.js';
import Company from '../models/Company.js';
import { convertCurrency } from '../services/currencyService.js';

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, receiptUrl } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Resolve the default ApprovalFlow for this company
    const flow = await ApprovalFlow.findOne({ companyId: req.user.companyId, isDefault: true });
    if (!flow) {
      return res.status(400).json({ message: 'No default approval flow configured for this company. Please contact your Admin.' });
    }

    // Fetch the company base currency for conversion
    const company = await Company.findById(req.user.companyId);
    const baseCurrency = company?.baseCurrency || 'USD';

    // Currency conversion — fallback gracefully if the rate API is down
    let convertedAmount = amount;
    let exchangeRate = 1;
    try {
      const result = await convertCurrency(amount, currency, baseCurrency);
      convertedAmount = result.convertedAmount;
      exchangeRate = result.rate;
    } catch (convErr) {
      console.warn(`⚠️  Currency conversion failed (${currency} → ${baseCurrency}): ${convErr.message}. Storing original amount as fallback.`);
    }

    const expense = await Expense.create({
      employeeId: req.user._id,
      companyId: req.user.companyId,
      approvalFlowId: flow._id,
      amount,
      currency,
      convertedAmount,
      exchangeRate,
      category,
      description,
      receiptUrl,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's expenses
// @route   GET /api/expenses/my
// @access  Private
export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team expenses (for Managers/Admins)
// @route   GET /api/expenses/team
// @access  Private/(Manager/Admin)
export const getTeamExpenses = async (req, res) => {
  try {
    let userIds = [];

    if (req.user.role === 'Admin') {
      const users = await User.find({ companyId: req.user.companyId });
      userIds = users.map(u => u._id);
    } else if (req.user.role === 'Manager') {
      const users = await User.find({ managerId: req.user._id });
      userIds = users.map(u => u._id);
    } else {
      return res.status(403).json({ message: 'Not authorized to view team expenses' });
    }

    const expenses = await Expense.find({ employeeId: { $in: userIds } })
      .populate('employeeId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
