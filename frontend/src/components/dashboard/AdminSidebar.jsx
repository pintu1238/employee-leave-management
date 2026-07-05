import {  FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers,} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-red-600 h-12 flex items-center justify-center">
        <h4 className="text-2xl text-center font-pacific">Leave Management</h4>
      </div>

      <div className="px-4">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => `${isActive ? "bg-red-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500`}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) => `${isActive ? "bg-red-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500`}>
          <FaUsers />
          <span>Employee</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/department"
          className={({ isActive }) => `${isActive ? "bg-red-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500`}>
          <FaBuilding />
          <span>Department</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leaves"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500"
        >
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
