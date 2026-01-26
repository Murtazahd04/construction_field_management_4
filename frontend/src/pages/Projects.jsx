import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails, assignContractor } from '../features/projects/projectSlice';
import { Loader2, MapPin, Calendar, DollarSign, Users, Plus, ArrowLeft } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProject, contractorsList, loading } = useSelector((state) => state.projects);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Form State for Assignment
  const [assignData, setAssignData] = useState({
    contractor_id: '',
    work_scope: '',
    contract_value: ''
  });

  useEffect(() => {
    dispatch(fetchProjectDetails(id));
    dispatch(fetchContractors());
  }, [dispatch, id]);

  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignContractor({ 
        project_id: id, 
        ...assignData 
    }));
    setShowAssignModal(false);
  };

  if (loading || !currentProject) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <button onClick={() => navigate('/projects')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentProject.project_name}</h1>
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {currentProject.location} | Code: {currentProject.project_code}
                </p>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                {currentProject.status}
            </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><DollarSign /></div>
                <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-bold text-lg">${Number(currentProject.budget).toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Calendar /></div>
                <div>
                    <p className="text-sm text-gray-500">Timeline</p>
                    <p className="font-medium">{new Date(currentProject.start_date).toLocaleDateString()} - {new Date(currentProject.end_date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Contractors Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5" /> Assigned Contractors</h2>
                    <button 
                        onClick={() => setShowAssignModal(true)}
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-black transition"
                    >
                        <Plus className="w-4 h-4" /> Assign New
                    </button>
                </div>

                <div className="space-y-3">
                    {currentProject.contractors && currentProject.contractors.length > 0 ? (
                        currentProject.contractors.map((c) => (
                            <div key={c.user_id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{c.username}</h4>
                                    <p className="text-sm text-gray-500">{c.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Contractor</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4 italic">No contractors assigned yet.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Placeholder for Member 2 Task 2: DPR List */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-full">
                <h2 className="text-xl font-bold mb-4">Daily Reports</h2>
                <div className="text-center py-10 bg-gray-50 rounded border border-dashed">
                    <p className="text-gray-400 text-sm">Select a contractor to view reports.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Assign Contractor</h2>
                <form onSubmit={handleAssign} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Contractor</label>
                        <select 
                            className="input-field" 
                            required
                            onChange={(e) => setAssignData({...assignData, contractor_id: e.target.value})}
                        >
                            <option value="">-- Choose --</option>
                            {contractorsList.map(c => (
                                <option key={c.user_id} value={c.user_id}>{c.username} ({c.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Work Scope</label>
                        <input 
                            className="input-field" 
                            placeholder="e.g. Electrical Wiring"
                            onChange={(e) => setAssignData({...assignData, work_scope: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contract Value</label>
                        <input 
                            type="number"
                            className="input-field" 
                            placeholder="$$$"
                            onChange={(e) => setAssignData({...assignData, contract_value: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetails;