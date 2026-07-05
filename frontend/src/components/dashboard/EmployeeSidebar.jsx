import { FaCalendarAlt, FaTachometerAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const EmployeeSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-red-600 h-12 flex items-center justify-center">
        <h4 className="text-2xl text-center font-pacific">Leave Management</h4>
      </div>

      <div className="px-4">
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) => `${isActive ? "bg-red-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500`}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/leaves"
          className={({ isActive }) => `${isActive ? "bg-red-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-red-500`}>
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
