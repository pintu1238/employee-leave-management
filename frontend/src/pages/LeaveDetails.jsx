import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const LeaveDetails = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/leave/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) setLeave(res.data.leave);
      } catch (err) {
        console.error(err);
        setError('Unable to load leave details.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `/api/leave/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setLeave((prev) => ({ ...prev, status: status }));
    } catch (err) {
      console.error(err);
      setError('Unable to update leave status.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!leave) return <div className="p-8">Leave not found.</div>;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Leave Request</h2>
          <span className={`px-3 py-1 rounded text-sm ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {leave.status}
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            {leave.profileImage ? (
              <img src={leave.profileImage} alt={leave.user_name} className="w-56 h-56 object-cover rounded-full" />
            ) : (
              <div className="w-56 h-56 bg-gray-200 rounded-full" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{leave.user_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="text-lg font-semibold">{leave.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-lg font-semibold">{leave.department || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="text-lg font-semibold">{leave.leave_type}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="text-lg font-semibold">{leave.reason}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-lg font-semibold">{leave.start_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-lg font-semibold">{leave.end_date}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <button onClick={() => updateStatus('Approved')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Accept</button>
              <button onClick={() => updateStatus('Rejected')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
              <button onClick={() => navigate(-1)} className="bg-gray-200 text-gray-900 px-4 py-2 rounded">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
