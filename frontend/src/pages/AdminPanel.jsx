import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchPendingCompanies, 
    approveCompany, 
    clearApprovalResult 
} from '../features/auth/authSlice';

const AdminPanel = () => {
    const dispatch = useDispatch();
    
    // Select data from Redux Store
    const { 
        pendingCompanies, 
        approvalResult, 
        isLoading, 
        error 
    } = useSelector((state) => state.auth);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchPendingCompanies());
    }, [dispatch]);

    const handleApprove = (ownerId) => {
        if(window.confirm("Are you sure you want to approve this company?")) {
            dispatch(approveCompany(ownerId));
        }
    };

    return (
        <div className="container mt-5">
            <h2>Super Admin Dashboard</h2>
            
            {/* SUCCESS BOX: Show Generated Credentials */}
            {approvalResult && (
                <div className="alert alert-success border border-success p-4 mb-4">
                    <h4>✅ Company Approved Successfully!</h4>
                    <p>Please copy these credentials and send them to the owner:</p>
                    <div className="bg-white p-3 border rounded">
                        <p className="mb-1"><strong>Company:</strong> {approvalResult.company}</p>
                        <p className="mb-1"><strong>Email:</strong> {approvalResult.generated_credentials.email}</p>
                        <p className="mb-0"><strong>Password:</strong> 
                            <span className="text-danger fw-bold ms-2">
                                {approvalResult.generated_credentials.password}
                            </span>
                        </p>
                    </div>
                    <button 
                        className="btn btn-sm btn-outline-success mt-3" 
                        onClick={() => dispatch(clearApprovalResult())}
                    >
                        Close & Clear
                    </button>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <h4 className="mt-4">Pending Company Requests</h4>
            
            {isLoading && <p>Loading requests...</p>}

            {!isLoading && pendingCompanies.length === 0 ? (
                <p className="text-muted">No pending requests.</p>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Date Requested</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingCompanies.map((company) => (
                            <tr key={company.owner_id}>
                                <td>{company.company_name}</td>
                                <td>{company.contact_person}</td>
                                <td>{company.email}</td>
                                <td>{new Date(company.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApprove(company.owner_id)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : 'Approve'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;