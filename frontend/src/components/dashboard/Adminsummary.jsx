
import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCard from "./SummaryCard";
import { FaUsers, FaBuilding, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    rejectedLeaves: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/leave/summary`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          setSummary(res.data.summary);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-10">Dashboard Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} />
        <SummaryCard icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-6">
          <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={summary.totalLeaves} />
          <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={summary.approvedLeaves} />
          <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={summary.pendingLeaves} />
          <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={summary.rejectedLeaves} />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;