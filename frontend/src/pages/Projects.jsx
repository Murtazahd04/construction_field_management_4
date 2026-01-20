import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject } from '../features/projects/projectSlice';
import { Plus, MapPin, Calendar, DollarSign, Briefcase, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, loading } = useSelector((state) => state.projects);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    location: '',
    budget: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(formData));
    if (result.type === 'projects/create/fulfilled') {
      setShowModal(false);
      setFormData({ project_name: '', project_code: '', location: '', budget: '', start_date: '', end_date: '' });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm">Manage active construction sites</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.project_id} 
              onClick={() => navigate(`/projects/${project.project_id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {project.status || 'Active'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{project.project_name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {project.location}
              </p>

              <div className="space-y-2 border-t border-gray-50 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Start</span>
                  <span className="font-medium">{new Date(project.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Budget</span>
                  <span className="font-medium text-gray-900">${Number(project.budget).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No projects found. Create your first one!</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input name="project_name" required onChange={handleChange} className="input-field" placeholder="e.g. Skyline Towers" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Code</label>
                  <input name="project_code" required onChange={handleChange} className="input-field" placeholder="e.g. SK-2024" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input name="location" required onChange={handleChange} className="input-field" placeholder="City, State" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                <input name="budget" type="number" required onChange={handleChange} className="input-field" placeholder="1000000" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input name="start_date" type="date" required onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input name="end_date" type="date" required onChange={handleChange} className="input-field" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;