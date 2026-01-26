import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const RegisterCompany = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get loading/error state from Redux
    const { isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Dispatch the Redux Action
        const resultAction = await dispatch(registerCompany(formData));
        
        if (registerCompany.fulfilled.match(resultAction)) {
            // Reset form on success
            setFormData({
                company_name: '', contact_person: '', email: '', phone: '', address: ''
            });
            // You can also navigate to a "Thank You" page or Login
            // navigate('/login'); 
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-header bg-primary text-white">
                    <h3>Register Your Construction Company</h3>
                </div>
                <div className="card-body">
                    {/* Error Alert from Redux State */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* ... (Input fields remain mostly the same) ... */}
                        <div className="mb-3">
                            <label>Company Name</label>
                            <input type="text" name="company_name" className="form-control" 
                                required value={formData.company_name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Contact Person</label>
                            <input type="text" name="contact_person" className="form-control" 
                                required value={formData.contact_person} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Email Address</label>
                            <input type="email" name="email" className="form-control" 
                                required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input type="text" name="phone" className="form-control" 
                                required value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Address</label>
                            <textarea name="address" className="form-control" 
                                rows="3" value={formData.address} onChange={handleChange}></textarea>
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                    <div className="mt-3 text-center">
                        <Link to="/login">Already have an account? Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;