import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchProjectDetails, 
    fetchContractors, 
    assignContractor, 
    fetchProjectDPRs, 
    createDPR // <--- Import Create Action
} from '../features/projects/projectSlice';
import { Loader2, MapPin, Calendar, DollarSign, Users, Plus, ArrowLeft, FileText, Sun, AlertTriangle, X } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProject, contractorsList, dprList, loading } = useSelector((state) => state.projects);
  
  // Modals State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDPRModal, setShowDPRModal] = useState(false); // <--- New Modal State
  
  // Assignment Form State
  const [assignData, setAssignData] = useState({
    contractor_id: '',
    work_scope: '',
    contract_value: ''
  });

  // DPR Form State (Professional Fields)
  const [dprData, setDprData] = useState({
    report_date: new Date().toISOString().split('T')[0], // Default to today
    weather_condition: 'Sunny',
    temperature: '',
    work_description: '',
    work_completed: '',
    work_planned_next_day: '',
    safety_observations: '',
    progress_percentage: ''
  });

  useEffect(() => {
    dispatch(fetchProjectDetails(id));
    dispatch(fetchContractors());
    dispatch(fetchProjectDPRs(id));
  }, [dispatch, id]);

  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignContractor({ project_id: id, ...assignData }));
    setShowAssignModal(false);
  };

  const handleCreateDPR = async (e) => {
    e.preventDefault();
    // In a real app, 'engineer_id' comes from the logged-in user. 
    // For now, we simulate it or pass a dummy ID (e.g., 1) since we are in Admin View.
    await dispatch(createDPR({ 
        project_id: id, 
        engineer_id: 1, // Placeholder for current user
        ...dprData 
    }));
    setShowDPRModal(false);
    // Reset form
    setDprData({
        report_date: new Date().toISOString().split('T')[0],
        weather_condition: 'Sunny',
        temperature: '',
        work_description: '',
        work_completed: '',
        work_planned_next_day: '',
        safety_observations: '',
        progress_percentage: ''
    });
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
                {currentProject.status || 'Active'}
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
                    <p className="font-medium">{new Date(currentProject.start_date).toLocaleDateString()} - {new Date(currentProject.expected_end_date || currentProject.end_date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contractors List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5" /> Assigned Contractors</h2>
                    <button onClick={() => setShowAssignModal(true)} className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-black transition">
                        <Plus className="w-4 h-4" /> Assign New
                    </button>
                </div>
                <div className="space-y-3">
                    {currentProject.contractors && currentProject.contractors.length > 0 ? (
                        currentProject.contractors.map((c) => (
                            <div key={c.assignment_id || c.contractor_id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{c.company_name || c.contact_person}</h4>
                                    <p className="text-sm text-gray-500">{c.email}</p>
                                    <p className="text-xs text-blue-600 mt-1 font-medium">Scope: {c.work_scope}</p>
                                </div>
                                <div className="text-right"><span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Contractor</span></div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4 italic">No contractors assigned yet.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Daily Reports Column */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Daily Reports</h2>
                    
                    {/* NEW: Button to Open DPR Modal */}
                    <button onClick={() => setShowDPRModal(true)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition" title="Log New Report">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 max-h-[500px] pr-2">
                    {dprList.length > 0 ? (
                        dprList.map((dpr) => (
                            <div key={dpr.dpr_id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{new Date(dpr.report_date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400">by {dpr.SiteEngineer ? dpr.SiteEngineer.full_name : 'Site Engineer'}</p>
                                    </div>
                                    {dpr.weather_condition && (
                                        <div className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                            <Sun className="w-3 h-3" /> {dpr.temperature}°C
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2">{dpr.work_description}</p>
                                {dpr.safety_observations && (
                                    <div className="flex items-start gap-1.5 mt-2 bg-red-50 p-2 rounded text-xs text-red-700">
                                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        <span>{dpr.safety_observations}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded border border-dashed">
                            <p className="text-gray-400 text-sm">No daily reports found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL 1: Assign Contractor --- */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Assign Contractor</h2>
                    <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleAssign} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Contractor</label>
                        <select className="input-field" required onChange={(e) => setAssignData({...assignData, contractor_id: e.target.value})}>
                            <option value="">-- Choose --</option>
                            {contractorsList.map(c => (<option key={c.contractor_id} value={c.contractor_id}>{c.company_name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Work Scope</label>
                        <input className="input-field" placeholder="e.g. Electrical Wiring" onChange={(e) => setAssignData({...assignData, work_scope: e.target.value})}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contract Value</label>
                        <input type="number" className="input-field" placeholder="$$$" onChange={(e) => setAssignData({...assignData, contract_value: e.target.value})}/>
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-2">Assign Contractor</button>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL 2: Create DPR (Professional Form) --- */}
      {showDPRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
                <button onClick={() => setShowDPRModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X className="w-6 h-6"/></button>
                <h2 className="text-2xl font-bold mb-1">Log Daily Progress</h2>
                <p className="text-sm text-gray-500 mb-6">Record site activities, weather, and safety notes.</p>
                
                <form onSubmit={handleCreateDPR} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Date & Weather Section */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input type="date" className="input-field" required 
                            value={dprData.report_date} 
                            onChange={(e) => setDprData({...dprData, report_date: e.target.value})} 
                        />
                    </div>
                    <div className="col-span-1 grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Weather</label>
                            <select className="input-field" value={dprData.weather_condition} onChange={(e) => setDprData({...dprData, weather_condition: e.target.value})}>
                                <option>Sunny</option>
                                <option>Cloudy</option>
                                <option>Rainy</option>
                                <option>Windy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Temp (°C)</label>
                            <input type="number" className="input-field" placeholder="30" 
                                value={dprData.temperature} onChange={(e) => setDprData({...dprData, temperature: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* Work Progress Section */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium mb-1">General Work Description</label>
                        <textarea className="input-field h-24" placeholder="Brief summary of today's activities..." required
                            value={dprData.work_description} onChange={(e) => setDprData({...dprData, work_description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="col-span-1">
                         <label className="block text-sm font-medium mb-1">Work Completed Today</label>
                         <textarea className="input-field h-20" placeholder="Specific tasks finished..."
                            value={dprData.work_completed} onChange={(e) => setDprData({...dprData, work_completed: e.target.value})}
                         ></textarea>
                    </div>
                    <div className="col-span-1">
                         <label className="block text-sm font-medium mb-1">Planned for Tomorrow</label>
                         <textarea className="input-field h-20" placeholder="Tasks for next shift..."
                            value={dprData.work_planned_next_day} onChange={(e) => setDprData({...dprData, work_planned_next_day: e.target.value})}
                         ></textarea>
                    </div>

                    {/* Safety & Metrics */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-red-600">Safety / Quality Observations</label>
                        <input className="input-field border-red-200 focus:ring-red-500" placeholder="Any accidents, near-misses, or quality defects?" 
                             value={dprData.safety_observations} onChange={(e) => setDprData({...dprData, safety_observations: e.target.value})}
                        />
                    </div>

                    <div className="col-span-1">
                         <label className="block text-sm font-medium mb-1">Estimated Progress (%)</label>
                         <input type="number" className="input-field" placeholder="0-100" min="0" max="100"
                             value={dprData.progress_percentage} onChange={(e) => setDprData({...dprData, progress_percentage: e.target.value})}
                         />
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-4">
                        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg">
                            Submit Daily Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;