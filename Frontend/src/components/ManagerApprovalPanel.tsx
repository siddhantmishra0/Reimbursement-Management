import React, { useState } from 'react';

export interface ApprovalRecord {
  approverId: string;
  action: 'Approved' | 'Rejected';
  comment?: string;
  stepIndex: number;
  date: string;
}

export interface Expense {
  _id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvals: ApprovalRecord[];
  currentStepIndex: number;
  employeeName?: string; 
  receiptUrl?: string;
}

interface ManagerApprovalPanelProps {
  expenses: Expense[];
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  isLoading?: boolean;
}

const ManagerApprovalPanel: React.FC<ManagerApprovalPanelProps> = ({ expenses, onApprove, onReject, isLoading }) => {
  const [comment, setComment] = useState<string>('');
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
        <svg className="w-16 h-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-700">All Caught Up!</h3>
        <p className="text-slate-500 text-sm mt-2">No pending expenses require your approval right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          Pending Approvals
        </h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
          {expenses.length} Requests
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {expenses.map((expense) => (
          <div 
            key={expense._id} 
            className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 border border-slate-100 relative overflow-hidden"
          >
            {/* Decorative Top Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${expense.status === 'Pending' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-slate-200'}`}></div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {expense.employeeName ? expense.employeeName.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{expense.employeeName || 'Unknown Employee'}</h3>
                    <p className="text-xs text-slate-500 font-medium">Step {expense.currentStepIndex + 1}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Pending
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Category</p>
                  <p className="text-sm text-slate-800 bg-slate-50 inline-block px-3 py-1 rounded-lg border border-slate-100">{expense.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Description</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{expense.description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Amount</p>
                  <p className="text-2xl font-black text-slate-800">
                    <span className="text-lg mr-1">{expense.currency}</span>
                    {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                {expense.receiptUrl && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Receipt</p>
                    <a 
                      href={expense.receiptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>View Attachment</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Approval Chain (Mini view) */}
              {expense.approvals && expense.approvals.length > 0 && (
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Prior Approvals</p>
                  <div className="flex flex-wrap gap-2">
                    {expense.approvals.map((app, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium text-green-800">Step {app.stepIndex + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100/80">
              {activeExpenseId === expense._id ? (
                <div className="space-y-3 animate-in fade-in zoom-in duration-200">
                  <textarea
                    className="w-full text-sm rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 resize-none transition-shadow"
                    rows={2}
                    placeholder="Add an optional comment... (Required for rejection)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onReject(expense._id, comment);
                        setActiveExpenseId(null);
                        setComment('');
                      }}
                      className="flex-1 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-semibold rounded-xl transition-colors duration-200 max-h-10"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        onApprove(expense._id, comment);
                        setActiveExpenseId(null);
                        setComment('');
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 max-h-10"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setActiveExpenseId(null);
                        setComment('');
                      }}
                      className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors max-h-10"
                      title="Cancel"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveExpenseId(expense._id)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 text-sm font-bold rounded-xl transition-all duration-200 flex justify-center items-center space-x-2 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-700"
                >
                  <span>Review Request</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerApprovalPanel;
