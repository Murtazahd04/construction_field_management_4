import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEnquiry } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';

const Enquiry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    role: 'owner'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitEnquiry(formData));
    if (result.type === 'auth/enquiry/fulfilled') {
      // Optional: Redirect back to login after a delay
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-lg relative">
        {/* Back Button */}
        <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 mt-4">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Partner with Us</h1>
          <p className="text-gray-500 text-sm mt-2">
            Register your company to access the Construction Management System.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- NEW ROLE DROPDOWN --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field bg-white" // ensure bg is white
            >
              <option value="owner">Owner (Project Developer)</option>
              <option value="contractor">Contractor (Builder)</option>
              <option value="consultant">Consultant (Architect/Engineer)</option>
              <option value="sub_contractor">Sub-Contractor (Specialist)</option>
            </select>
          </div>
          {/* ------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                name="full_name" 
                onChange={handleChange} 
                className="input-field" 
                placeholder="John Doe"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                name="phone" 
                onChange={handleChange} 
                className="input-field" 
                placeholder="+91 98765..."
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
            <input 
              name="email" 
              type="email"
              onChange={handleChange} 
              className="input-field" 
              placeholder="admin@company.com"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              name="company_name" 
              onChange={handleChange} 
              className="input-field" 
              placeholder="BuildRight Constructions Pvt Ltd"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-2 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;