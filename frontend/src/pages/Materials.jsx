// frontend/src/pages/Materials.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials, fetchRequests, approveRequest } from '../features/materials/materialSlice';
import { Loader2, Package, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

const Materials = () => {
    const dispatch = useDispatch();
    const { materialsList, requestsList, loading } = useSelector((state) => state.materials);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'approvals'

    useEffect(() => {
        dispatch(fetchMaterials());
        dispatch(fetchRequests());
    }, [dispatch]);

    // Filter for Pending Requests
    const pendingRequests = requestsList.filter(r => 
        ['pending', 'contractor_approved', 'consultant_approved'].includes(r.status)
    );

    const handleApprove = (id) => {
        if(window.confirm("Approve this material request?")) {
            dispatch(approveRequest({ id, remarks: "Approved via Web Dashboard" }));
        }
    };

    if (loading && materialsList.length === 0) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="text-blue-600" /> Material Management
            </h1>

            {/* --- TABS --- */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'inventory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Inventory Master
                </button>
                <button 
                    onClick={() => setActiveTab('approvals')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'approvals' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Approval Hub 
                    {pendingRequests.length > 0 && <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}
                </button>
            </div>

            {/* --- TAB 1: INVENTORY LIST --- */}
            {activeTab === 'inventory' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Material Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Unit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materialsList.map((m) => (
                                <tr key={m.material_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{m.material_code}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{m.material_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs capitalize">{m.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{m.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB 2: APPROVAL HUB --- */}
            {activeTab === 'approvals' && (
                <div className="space-y-4">
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((req) => (
                            <div key={req.request_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">
                                            Request #{req.request_id} 
                                            <span className="ml-2 text-sm font-normal text-gray-500">by {req.Requestor?.username || 'Unknown'}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" /> {new Date(req.request_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {req.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-gray-500 border-b border-gray-200">
                                                <th className="pb-2 text-left">Material</th>
                                                <th className="pb-2 text-right">Qty Requested</th>
                                                <th className="pb-2 text-right">Unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {req.MaterialRequestItems?.map((item) => (
                                                <tr key={item.item_id} className="border-b border-gray-100 last:border-0">
                                                    <td className="py-2 font-medium">{item.Material?.material_name}</td>
                                                    <td className="py-2 text-right">{item.quantity_requested}</td>
                                                    <td className="py-2 text-right text-gray-500">{item.Material?.unit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2">
                                        View Details
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(req.request_id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve Request
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                            <p className="text-gray-500">No pending material requests found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Materials;