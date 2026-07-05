import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/dashboard/EmployeeSidebar";
import Navbar from "../components/dashboard/Navbar";

const EmployeeLayout = () => {
  return (
    <div>
      <EmployeeSidebar />
      <div className="ml-64">
        <Navbar />
        <div className="bg-gray-100 min-h-[calc(100vh-48px)] p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
