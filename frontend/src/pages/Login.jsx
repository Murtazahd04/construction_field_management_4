// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));
        if (result.type === 'auth/login/fulfilled') {
            navigate('/dashboard'); // Redirect after success
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to manage your construction sites</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="admin@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                    </button>
                </form>
                {/* --- NEW ADMIN LINK HERE --- */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/admin-login')}
                        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors py-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Sign in as Admin
                    </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    New Company?{' '}
                    <Link to="/register-enquiry" className="text-primary font-medium hover:underline">
                        Register Company
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default Login;