import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [depName, setDepName] = useState("");
  const [description, setDescription] = useState("");

  const fetchDepartments = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const url = `/api/department${query ? `?search=${encodeURIComponent(query)}` : ""}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchDepartments();
    };
    load();
  }, []);

  const handleSearch = () => {
    fetchDepartments(searchTerm);
  };

  const handleEdit = (dept) => {
    setEditingDepartment(dept);
    setDepName(dept.dep_name);
    setDescription(dept.description || "");
  };

  const handleUpdate = async () => {
    if (!editingDepartment) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/department/${editingDepartment.id}`,
        { dep_name: depName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setEditingDepartment(null);
        setDepName("");
        setDescription("");
        fetchDepartments(searchTerm);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/department/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchDepartments(searchTerm);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-3xl font-bold">Manage Departments</h3>
          <p className="text-sm text-gray-500">Search, edit, or remove departments from the system.</p>
        </div>
        <Link
          to="/admin-dashboard/add-department"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add Department
        </Link>
      </div>

      <div className="flex gap-3 items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by department name"
          className="border px-4 py-2 rounded w-72"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button onClick={handleSearch} className="bg-teal-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept, idx) => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.dep_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{dept.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(dept.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingDepartment && (
        <div className="mt-8 bg-white rounded shadow p-6">
          <h4 className="text-xl font-semibold mb-4">Edit Department</h4>
          <div className="grid gap-4">
            <input
              type="text"
              value={depName}
              onChange={(e) => setDepName(e.target.value)}
              placeholder="Department name"
              className="border px-4 py-2 rounded w-full"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border px-4 py-2 rounded w-full h-24"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="bg-teal-600 text-white px-4 py-2 rounded">Save changes</button>
              <button onClick={() => setEditingDepartment(null)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;