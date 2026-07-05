import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaves = async (status = "", search = "") => {
    try {
      const token = localStorage.getItem("token");
      const params = [];
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      const q = params.length ? `?${params.join("&")}` : "";
      const res = await axios.get(`/api/leave${q}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSearch = () => {
    fetchLeaves(filter, searchTerm);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t">
          <h2 className="text-xl font-semibold">Leave Requests</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex gap-2 items-center w-full md:w-1/2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by employee or leave type"
                className="border px-4 py-2 rounded w-full"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button onClick={handleSearch} className="bg-gray-800 text-white px-4 py-2 rounded">Search</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setFilter(status); fetchLeaves(status, searchTerm); }}
                  className={`px-4 py-2 rounded ${filter === status ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {status || 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave, idx) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.leave_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.start_date} - {leave.end_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link to={`/admin-dashboard/leaves/${leave.id}`} className="text-red-600 hover:text-red-800">View</Link>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">No leave requests found.</td>
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

export default AdminLeaves;
