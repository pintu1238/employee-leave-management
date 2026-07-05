import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/adminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeLayout from "./pages/EmployeeLayout";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RolebasedRoutes";
import Adminsummary from "./components/dashboard/Adminsummary";
import DepartmentList from "./components/department/Departments";
import AddDepartment from "./components/department/AddDepartment";
import AdminEmployees from "./pages/AdminEmployees";
import AdminLeaves from "./pages/AdminLeaves";
import LeaveDetails from "./pages/LeaveDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<Adminsummary />} />
        <Route path="department" element={<DepartmentList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="leaves" element={<AdminLeaves />} />
        <Route path="leaves/:id" element={<LeaveDetails />} />
      </Route>

      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["employee"]}>
              <EmployeeLayout />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="leaves" element={<EmployeeLeaves />} />
      </Route>
    </Routes>
  );
}

export default App;