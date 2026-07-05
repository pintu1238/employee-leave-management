import { useEffect, useState } from "react";
import axios from "axios";

const LIMIT = 15;

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEmployees = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/employee?page=${pageNumber}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t">
          <h2 className="text-xl font-semibold">Employee List</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp, idx) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(page - 1) * LIMIT + idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.department || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(emp.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`rounded px-4 py-2 text-white ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded px-4 py-2 text-white ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
