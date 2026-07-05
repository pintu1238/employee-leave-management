import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchLeaves = async (status = '', search = '') => {
    try {
      const token = localStorage.getItem('token');
      let query = [];
      if (status) query.push(`status=${encodeURIComponent(status)}`);
      if (search) query.push(`search=${encodeURIComponent(search)}`);
      const q = query.length ? `?${query.join('&')}` : '';
      const res = await axios.get(`/api/leave${q}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleFilter = (status) => {
    setStatusFilter(status);
    fetchLeaves(status, searchTerm);
  };

  const handleSearch = () => {
    fetchLeaves(statusFilter, searchTerm);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t"><h2 className="text-xl font-semibold">Employee Leave Requests</h2></div>
        <div className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex gap-2 items-center w-full md:w-1/2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search By Emp ID or Name"
                className="border px-4 py-2 rounded w-full"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button onClick={handleSearch} className="bg-gray-800 text-white px-4 py-2 rounded">Search</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['', 'Pending', 'Approved', 'Rejected'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleFilter(label)}
                  className={`px-4 py-2 rounded ${statusFilter === label ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {label || 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{l.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.leave_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.department || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{l.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${l.status === 'Approved' ? 'bg-green-100 text-green-800' : l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="bg-teal-600 text-white px-3 py-1 rounded" onClick={() => navigate(`/admin-dashboard/leaves/${l.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">No leaves found.</td>
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

export default Leaves;
