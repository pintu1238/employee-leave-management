import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/dashboard/Navbar";
import Adminsummary from "../components/dashboard/Adminsummary";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <AdminSidebar />

      <div className="ml-64">
        <Navbar />
        <Outlet />
        

        <div className="bg-gray-100 h-[calc(100vh-48px)] p-5">
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;