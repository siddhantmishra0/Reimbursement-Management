import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovalFlows, createApprovalFlow, updateApprovalFlow, deleteApprovalFlow } from '../../features/approvalFlows/approvalFlowSlice';
import type { ApprovalFlow, ApprovalStep } from '../../features/approvalFlows/approvalFlowSlice';
import { fetchUsers } from '../../features/users/userSlice';
import type { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { flows, loading, error } = useSelector((state: RootState) => state.approvalFlows);
  const { users } = useSelector((state: RootState) => state.users);

  const [isEditing, setIsEditing] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<Partial<ApprovalFlow>>({
    name: '',
    isDefault: false,
    steps: []
  });

  useEffect(() => {
    if (userInfo?.role !== 'Admin') {
      navigate('/');
      return;
    }
    dispatch(fetchApprovalFlows());
    dispatch(fetchUsers());
  }, [dispatch, userInfo, navigate]);

  const handleCreateNew = () => {
    setCurrentFlow({ name: '', isDefault: false, steps: [] });
    setIsEditing(true);
  };

  const handleEdit = (flow: ApprovalFlow) => {
    setCurrentFlow(JSON.parse(JSON.stringify(flow))); // Deep copy
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this approval flow?')) {
      dispatch(deleteApprovalFlow(id));
    }
  };

  const addStep = () => {
    setCurrentFlow(prev => ({
      ...prev,
      steps: [...(prev.steps || []), { stepName: '', ruleType: 'Sequential', requiredRole: 'Manager' }]
    }));
  };

  const removeStep = (index: number) => {
    const newSteps = [...(currentFlow.steps || [])];
    newSteps.splice(index, 1);
    setCurrentFlow({ ...currentFlow, steps: newSteps });
  };

  const updateStep = (index: number, field: keyof ApprovalStep, value: any) => {
    const newSteps = [...(currentFlow.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setCurrentFlow({ ...currentFlow, steps: newSteps });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentFlow._id) {
      await dispatch(updateApprovalFlow({ id: currentFlow._id, data: currentFlow }));
    } else {
      await dispatch(createApprovalFlow(currentFlow));
    }
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
          <p className="text-gray-500 mt-1">Configure automated approval workflows</p>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 transition">Dashboard</button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded shadow-sm">{error}</div>}

      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={handleCreateNew} 
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              + Create Workflow
            </button>
          </div>

          <div className="grid gap-6">
            {flows.map(flow => (
              <div key={flow._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      {flow.name}
                      {flow.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">
                          Active Default
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(flow)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(flow._id)} className="text-sm font-medium text-rose-600 hover:text-rose-900 bg-rose-50 px-3 py-1.5 rounded transition">
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  <div className="flex-shrink-0 text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded">Submit</div>
                  {flow.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-300">→</span>
                      <div className="flex-shrink-0 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
                        <p className="text-sm font-bold text-blue-900">{step.stepName}</p>
                        <p className="text-xs text-blue-600 mt-0.5">{step.ruleType} • {step.requiredRole}</p>
                      </div>
                    </React.Fragment>
                  ))}
                  <span className="text-slate-300">→</span>
                  <div className="flex-shrink-0 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded">Approved</div>
                </div>
              </div>
            ))}
            {flows.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No approval flows found. Create one to get started.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-800">{currentFlow._id ? 'Edit Workflow' : 'Create Workflow'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Workflow Name</label>
                <input 
                  type="text" 
                  value={currentFlow.name} 
                  onChange={e => setCurrentFlow({...currentFlow, name: e.target.value})} 
                  placeholder="e.g., Executive Travel Approval"
                  className="w-full rounded-lg border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                  required 
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentFlow.isDefault} 
                    onChange={e => setCurrentFlow({...currentFlow, isDefault: e.target.checked})} 
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-700">Set as default for new expenses</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Approval Steps</h3>
                <button type="button" onClick={addStep} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                  + Add Step
                </button>
              </div>

              <div className="space-y-4">
                {currentFlow.steps?.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                    <button type="button" onClick={() => removeStep(idx)} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 font-bold bg-rose-50 rounded-full w-8 h-8 flex items-center justify-center transition opacity-0 group-hover:opacity-100">
                      ×
                    </button>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                        {idx + 1}
                      </div>
                      <h4 className="font-semibold text-slate-700">Step {idx + 1}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Step Name</label>
                        <input 
                          type="text" 
                          value={step.stepName} 
                          onChange={(e) => updateStep(idx, 'stepName', e.target.value)}
                          placeholder="e.g., Line Manager Review"
                          className="w-full text-sm rounded border-slate-300 p-2 border focus:border-indigo-500 outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rule Type</label>
                        <select 
                          value={step.ruleType}
                          onChange={(e) => updateStep(idx, 'ruleType', e.target.value)}
                          className="w-full text-sm rounded border-slate-300 p-2 border focus:border-indigo-500 outline-none bg-white"
                        >
                          <option value="Sequential">Sequential (Standard)</option>
                          <option value="Percentage">Percentage Base</option>
                          <option value="SpecificApprover">Specific Person</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Required Role</label>
                        <select 
                          value={step.requiredRole}
                          onChange={(e) => updateStep(idx, 'requiredRole', e.target.value)}
                          disabled={step.ruleType === 'SpecificApprover'}
                          className="w-full text-sm rounded border-slate-300 p-2 border focus:border-indigo-500 outline-none bg-white disabled:bg-slate-100"
                        >
                          <option value="Any">Any Role</option>
                          <option value="Manager">Manager Only</option>
                          <option value="Admin">Admin Only</option>
                        </select>
                      </div>

                      {step.ruleType === 'Percentage' && (
                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Percentage Required (%)</label>
                          <input 
                            type="number" 
                            min="1" max="100"
                            value={step.percentageRequired || ''} 
                            onChange={(e) => updateStep(idx, 'percentageRequired', parseFloat(e.target.value))}
                            className="w-1/3 text-sm rounded border-slate-300 p-2 border focus:border-indigo-500 outline-none" 
                            required 
                          />
                        </div>
                      )}

                      {step.ruleType === 'SpecificApprover' && (
                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Approver</label>
                          <select 
                            value={typeof step.specificApproverId === 'object' ? step.specificApproverId?._id : (step.specificApproverId || '')}
                            onChange={(e) => updateStep(idx, 'specificApproverId', e.target.value)}
                            className="w-full text-sm rounded border-slate-300 p-2 border focus:border-indigo-500 outline-none bg-white"
                            required
                          >
                            <option value="">-- Choose User --</option>
                            {users.map(u => (
                              <option key={u._id} value={u._id}>{u.name} ({u.email}) - {u.role}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {currentFlow.steps?.length === 0 && (
                  <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                    No steps added yet. A request without steps is instantly approved.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition">
                {loading ? 'Saving...' : 'Save Workflow'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
