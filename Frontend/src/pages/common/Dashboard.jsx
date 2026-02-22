import React, {useEffect, useState} from 'react';
import axios from '../../api/axiosInstance';

const InfoRow = ({label, value}) => (
    <div className="flex justify-between py-2">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium">{value ?? '—'}</div>
    </div>
);

const Dashboard = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        axios.get('/api/employees/me')
            .then(res => {
                if(mounted){
                    setEmployee(res.data);
                    setError(null);
                }
            })
            .catch(err => {
                if(mounted){
                    setError(err.response?.data?.message || err.message || 'Failed to load');
                }
            })
            .finally(() => mounted && setLoading(false));

        return () => mounted = false;
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
        </div>
    );

    return (
        <div className="min-h-[60vh] p-6 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {employee?.fullName || 'Employee'} 👋</h1>
                        <p className="text-sm text-gray-500 mt-1">Have a productive day at work</p>
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-white flex items-center justify-center shadow">
                        {employee?.profileImageUrl ? (
                            <img src={employee.profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-blue-600 font-bold text-xl">{(employee?.fullName || 'E').charAt(0)}</div>
                        )}
                    </div>
                </header>

                <section className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="md:w-1/2">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>
                            <div className="space-y-1">
                                <InfoRow label="Employee ID" value={employee?.employeeId} />
                                <InfoRow label="Email" value={employee?.email} />
                                <InfoRow label="Role" value={employee?.role} />
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 mb-4 invisible md:visible">Profile details</h2>
                            <div className="space-y-1">
                                <InfoRow label="Manager" value={employee?.managerName} />
                                <InfoRow label="Department" value={employee?.department} />
                                <InfoRow label="Designation" value={employee?.designation} />
                                <InfoRow label="Joined" value={employee?.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : null} />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;