import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiyb from '../api/axios';
import { LogOut, Building, CheckCircle, XCircle, Loader2, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  // Fetch Enquiries
  const fetchEnquiries = async () => {
    try {
      const response = await apiyb.get('/enquiry/all');
      setEnquiries(response.data);
    } catch (error) {
      console.error("Failed to load enquiries", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        dispatch(logout());
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin-login');
  };


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }
const handleApprove = async (id) => {
    if(!window.confirm("Approve this user? This will generate a password and email it to them.")) return;
    
    const toastId = toast.loading("Creating account and sending email...");
    
    try {
      await apiyb.put(`/enquiry/${id}/approve`);
      toast.success("Approved! Credentials sent.", { id: toastId });
      fetchEnquiries(); // Refresh table
    } catch (error) {
      console.error(error);
      toast.error("Approval failed. Check server logs.", { id: toastId });
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to reject this request?")) return;

    try {
      await apiyb.put(`/enquiry/${id}/reject`);
      toast.success("Enquiry marked as Rejected.");
      fetchEnquiries(); // Refresh table
    } catch (error) {
      toast.error("Rejection failed.");
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar - Desktop (Fixed) & Mobile (Overlay) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building className="text-blue-500" /> Admin
          </h2>
          {/* Close button for mobile */}
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
            <XCircle />
          </button>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          <a href="#" className="block py-3 px-4 bg-blue-600 rounded-lg text-white font-medium shadow-md">
            Enquiries
          </a>
          <a href="#" className="block py-3 px-4 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg transition">
            Registered Companies
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm py-4 px-4 md:px-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Registration Enquiries</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium text-sm transition"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Responsive Table Container 
              overflow-x-auto: Enables horizontal scroll on mobile
            */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b">Date</th>
                    <th className="px-6 py-4 border-b">Role</th>
                    <th className="px-6 py-4 border-b">Company</th>
                    <th className="px-6 py-4 border-b">Contact Person</th>
                    <th className="px-6 py-4 border-b">Status</th>
                    <th className="px-6 py-4 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {enquiries.length > 0 ? (
                    enquiries.map((enquiry) => (
                      <tr key={enquiry.enquiry_id} className="hover:bg-blue-50/50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {enquiry.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {enquiry.company_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium">{enquiry.full_name}</span>
                            <span className="text-gray-500 text-xs">{enquiry.email}</span>
                            <span className="text-gray-500 text-xs">{enquiry.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${enquiry.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                            ${enquiry.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                           `}>
                             {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                           </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {enquiry.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => handleApprove(enquiry.enquiry_id)}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full transition"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleReject(enquiry.enquiry_id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Building className="w-8 h-8 opacity-20" />
                          <p>No new enquiries found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;