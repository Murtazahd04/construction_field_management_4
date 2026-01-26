// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import apiyb from '../api/axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Loader2, AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState([]);
    const [materialData, setMaterialData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]); // For Pie Chart
    const [lateComers, setLateComers] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch all data in parallel
                const [insightRes, matRes, attRes, lateRes] = await Promise.all([
                    apiyb.get('/reports/dashboard-insights'),
                    apiyb.get('/reports/material-summary'),
                    apiyb.get('/reports/attendance-trends'),
                    apiyb.get('/reports/late-comers')
                ]);

                // 2. Set Direct Data
                setInsights(insightRes.data);
                setLateComers(lateRes.data);

                // 3. Process Material Data (Group by Month for Line Chart)
                // The SQL returns rows per material per month. We need to sum them up per month.
                const processedMaterials = processMaterialData(matRes.data);
                setMaterialData(processedMaterials);

                // 4. Process Attendance (Take the latest day for Pie Chart)
                if (attRes.data.length > 0) {
                    const latest = attRes.data[0]; // Assuming sorted DESC
                    setAttendanceData([
                        { name: 'Present', value: parseInt(latest.present_count || 0) },
                        { name: 'Absent', value: parseInt(latest.absent_count || 0) },
                        { name: 'Late', value: parseInt(latest.late_count || 0) },
                    ]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper: Group Material Requests vs Consumption by Month
    const processMaterialData = (data) => {
        const grouped = {};
        data.forEach(item => {
            const month = item.summary_month; // e.g., "2024-01"
            if (!grouped[month]) {
                grouped[month] = { month, requested: 0, consumed: 0 };
            }
            grouped[month].requested += parseFloat(item.total_requested || 0);
            grouped[month].consumed += parseFloat(item.total_consumed || 0);
        });
        // Convert object to array and sort
        return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
    };

    if (loading) return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600"/></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Project Insights</h1>

            {/* --- TOP ROW: STATISTICS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle /></div>
                        <div>
                            <p className="text-sm text-gray-500">Critical Delays</p>
                            <h3 className="text-2xl font-bold">{insights.filter(i => i.has_critical_delays).length} Days</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><TrendingUp /></div>
                        <div>
                            <p className="text-sm text-gray-500">Avg Progress</p>
                            <h3 className="text-2xl font-bold">--%</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><Users /></div>
                        <div>
                            <p className="text-sm text-gray-500">Present Today</p>
                            <h3 className="text-2xl font-bold">{attendanceData.find(d => d.name === 'Present')?.value || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Clock /></div>
                        <div>
                            <p className="text-sm text-gray-500">Late Workers</p>
                            <h3 className="text-2xl font-bold">{lateComers.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE ROW: CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* 1. Bar Chart: Delays Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Delay Analysis (Hours)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={insights.slice(0, 14).reverse()}> {/* Show last 14 entries */}
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="insight_date" tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}/>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="rain_delay_hours" name="Rain" stackId="a" fill="#8884d8" />
                                <Bar dataKey="material_delay_hours" name="Material" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="other_delay_hours" name="Other" stackId="a" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Line Chart: Material Trends */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Material Trends (Qty)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={materialData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="requested" name="Requested" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="consumed" name="Consumed" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM ROW: ATTENDANCE & LATE COMERS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 3. Pie Chart: Attendance Snapshot */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1">
                    <h2 className="text-xl font-bold mb-4">Today's Attendance</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Table: Late Comers  */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Recent Late Comers
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Worker Name</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 text-right">Late By (Min)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lateComers.length > 0 ? (
                                    lateComers.map((worker) => (
                                        <tr key={worker.attendance_id} className="hover:bg-red-50 transition">
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(worker.report_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{worker.worker_name}</td>
                                            <td className="px-4 py-3 text-xs bg-gray-100 rounded-full inline-block mt-2">
                                                {worker.category}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-600 font-bold">
                                                {worker.late_by_minutes}m
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-6 text-gray-400">Everyone is on time! 🎉</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;