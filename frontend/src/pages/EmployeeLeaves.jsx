import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newLeave, setNewLeave] = useState({ leave_type: "", reason: "", start_date: "", end_date: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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

  const handleFieldChange = (field, value) => {
    setNewLeave((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/leave",
        {
          leave_type: newLeave.leave_type,
          reason: newLeave.reason,
          start_date: newLeave.start_date,
          end_date: newLeave.end_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("Leave request submitted successfully.");
        setNewLeave({ leave_type: "", reason: "", start_date: "", end_date: "" });
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unable to submit leave request.");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Request New Leave</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <input
                    type="text"
                    value={newLeave.leave_type}
                    onChange={(e) => handleFieldChange("leave_type", e.target.value)}
                    className="mt-2 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    value={newLeave.reason}
                    onChange={(e) => handleFieldChange("reason", e.target.value)}
                    className="mt-2 w-full rounded border px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.start_date}
                    onChange={(e) => handleFieldChange("start_date", e.target.value)}
                    className="mt-2 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={newLeave.end_date}
                    onChange={(e) => handleFieldChange("end_date", e.target.value)}
                    className="mt-2 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
              <button type="submit" className="rounded bg-red-600 px-5 py-3 text-white hover:bg-red-700">Submit Leave Request</button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">My Leave History</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex gap-2 items-center w-full md:w-1/2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by leave type"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave, idx) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leave_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.start_date} - {leave.end_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">No leave records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
